#[macro_use]
extern crate serde;
use candid::{Decode, Encode};
use ic_cdk::api::time;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{BoundedStorable, Cell, DefaultMemoryImpl, StableBTreeMap, Storable};
use std::{borrow::Cow, cell::RefCell};

type Memory = VirtualMemory<DefaultMemoryImpl>;
type IdCell = Cell<u64, Memory>;

#[derive(candid::CandidType, Clone, Debug)]
pub enum ServiceError {
    NotFound { msg: String },
    Other { msg: String },
}

#[derive(candid::CandidType, Clone, Serialize, Deserialize, Default)]
struct Asset {
    id: u64,
    title: String,
    description: String,
    asset_url: String,
    price: u64,
    creator_id: u64,
    created_at: u64,
    updated_at: Option<u64>,
}

impl Storable for Asset {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for Asset {
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static ID_COUNTER: RefCell<IdCell> = RefCell::new(
        IdCell::init(MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))), 0)
            .expect("Cannot create a counter")
    );

    static STORAGE: RefCell<StableBTreeMap<u64, Asset, Memory>> =
        RefCell::new(StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
    ));
}

#[derive(candid::CandidType, Serialize, Deserialize, Default)]
struct AssetPayload {
    title: String,
    description: String,
    asset_url: String,
    price: u64,
}

#[ic_cdk::query]
fn get_asset(id: u64) -> Result<Asset, ServiceError> {
    match _get_asset(&id) {
        Some(asset) => Ok(asset),
        None => Err(ServiceError::NotFound {
            msg: format!("an asset with id={} not found", id),
        }),
    }
}

fn _get_asset(id: &u64) -> Option<Asset> {
    STORAGE.with(|s| s.borrow().get(id))
}

#[ic_cdk::update]
fn add_asset(asset: AssetPayload, creator_id: u64) -> Option<Asset> {
    let id = ID_COUNTER
        .with(|counter| {
            let current_value = *counter.borrow().get();
            counter.borrow_mut().set(current_value + 1)
        })
        .expect("cannot increment id counter");
    let asset = Asset {
        id,
        title: asset.title,
        description: asset.description,
        asset_url: asset.asset_url,
        price: asset.price,
        creator_id,
        created_at: time(),
        updated_at: None,
    };
    do_insert(&asset);
    Some(asset)
}

fn do_insert(asset: &Asset) {
    STORAGE.with(|service| service.borrow_mut().insert(asset.id, asset.clone()));
}

#[ic_cdk::update]
fn update_asset(id: u64, payload: AssetPayload) -> Result<Asset, ServiceError> {
    match STORAGE.with(|service| service.borrow().get(&id)) {
        Some(mut asset) => {
            asset.description = payload.description;
            asset.asset_url = payload.asset_url;
            asset.title = payload.title;
            asset.price = payload.price;
            asset.updated_at = Some(time());
            do_insert(&asset);
            Ok(asset)
        }
        None => Err(ServiceError::NotFound {
            msg: format!(
                "couldn't update an asset with id={}. asset not found",
                id
            ),
        }),
    }
}

#[ic_cdk::update]
fn delete_asset(id: u64) -> Result<Asset, ServiceError> {
    match STORAGE.with(|service| service.borrow_mut().remove(&id)) {
        Some(asset) => Ok(asset),
        None => Err(ServiceError::NotFound {
            msg: format!(
                "couldn't delete an asset with id={}. asset not found.",
                id
            ),
        }),
    }
}


ic_cdk::export_candid!();
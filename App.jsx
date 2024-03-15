import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [activeFeature, setActiveFeature] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const handleLogin = (username, password) => {
    // Simulate authentication (replace with actual authentication logic)
    if (username && password) {
      setUser(username);
      // Simulate fetching wallet balance from server
      setWalletBalance(1000); // Initial wallet balance
      // Hide login form after successful login
      setShowLoginForm(false);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleDeposit = (amount) => {
    setWalletBalance((prevBalance) => prevBalance + amount);
  };

  const handleWithdraw = (amount) => {
    setWalletBalance((prevBalance) => prevBalance - amount);
  };

  const handleSignUp = (username, password) => {
    // Simulate sign-up process (replace with actual sign-up logic)
    alert(`User ${username} created successfully! Please log in.`);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature);
  };

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    setShowSignUpForm(false); // Hide sign-up form
  };

  const toggleSignUpForm = () => {
    setShowSignUpForm(!showSignUpForm);
    setShowLoginForm(false); // Hide login form
  };

  const HeaderFeature = ({ title, onClick }) => {
    return (
      <div className="header-feature" onClick={onClick}>
        {title}
      </div>
    );
  };

  const ContentSection = ({ title, children }) => {
    return (
      <div className="content-section">
        <h2>{title}</h2>
        {children}
      </div>
    );
  };

  const CreateOfferContent = () => {
    return (
      <ContentSection title="Create Offer">
        <p>This section allows users to create offers.</p>
      </ContentSection>
    );
  };

  const BecomeVendorContent = () => {
    return (
      <ContentSection title="Become a Vendor">
        <p>This section provides information on becoming a vendor.</p>
      </ContentSection>
    );
  };

  const WalletSection = ({ walletBalance, onDeposit, onWithdraw }) => {
    const [amount, setAmount] = useState(0);

    const handleDeposit = () => {
      if (amount > 0) {
        onDeposit(amount);
        setAmount(0);
      } else {
        alert('Please enter a valid amount');
      }
    };

    const handleWithdraw = () => {
      if (amount > 0 && amount <= walletBalance) {
        onWithdraw(amount);
        setAmount(0);
      } else {
        alert('Insufficient balance or invalid amount');
      }
    };

    return (
      <ContentSection title="Wallet">
        <p>Current Balance: ${walletBalance}</p>
        <div>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
          <button onClick={handleDeposit}>Deposit</button>
          <button onClick={handleWithdraw}>Withdraw</button>
        </div>
      </ContentSection>
    );
  };

  return (
    <div className="app">
      <header>
        <div className="header-left">
          <h1 className="logo">Wazito Coin</h1>
          <HeaderFeature title="Create Offer" onClick={() => handleFeatureClick('Create Offer')} />
          <HeaderFeature title="Wallet" onClick={() => handleFeatureClick('Wallet')} />
          <HeaderFeature title="Become a Vendor" onClick={() => handleFeatureClick('Become a Vendor')} />
        </div>
        <div className="header-right">
          {user && (
            <>
              <HeaderFeature title="Dashboard" onClick={() => handleFeatureClick('Dashboard')} />
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          )}
          {!user && (
            <>
              <button className="login-btn" onClick={toggleLoginForm}>Login</button>
              <button className="signup-btn" onClick={toggleSignUpForm}>Sign Up</button>
            </>
          )}
          {showLoginForm && <LoginForm onLogin={handleLogin} />}
          {showSignUpForm && <SignUpForm onSignUp={handleSignUp} />}
        </div>
      </header>
      <main>
        <div className="content">
          <Dashboard user={user} walletBalance={walletBalance} />
          {activeFeature === 'Create Offer' && <CreateOfferContent />}
          {activeFeature === 'Wallet' && (
            <WalletSection
              walletBalance={walletBalance}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
            />
          )}
          {activeFeature === 'Become a Vendor' && <BecomeVendorContent />}
          <BuySellPanel />
        </div>
        <div className="side">
          <div className="about">
            <h2>About Wazito Coin</h2>
            <p>
        Wazito Coin is a leading digital cryptocurrency exchange platform that
        provides a secure and user-friendly environment for buying, selling, and
        trading various cryptocurrencies. Our mission is to make cryptocurrency
        trading accessible to everyone, from seasoned investors to newcomers in
        the world of digital assets.
      </p>
      <p>
        At Wazito Coin, we prioritize transparency, security, and convenience.
        Our cutting-edge technology and robust security measures ensure that
        your transactions are safe and your digital assets are protected. We
        offer a wide range of cryptocurrencies, including Bitcoin, Ethereum,
        Litecoin, and many more, allowing you to diversify your portfolio and
        explore new investment opportunities.
      </p>
      <p>
        Our user-friendly interface and intuitive platform make it easy for
        beginners to navigate the world of cryptocurrency trading, while
        offering advanced tools and features for experienced traders. Whether
        you're looking to buy, sell, or trade cryptocurrencies, Wazito Coin is
        your trusted partner in the digital asset market.
      </p>
      <p>
        Join our growing community of cryptocurrency enthusiasts and stay
        up-to-date with the latest market trends, news, and analysis. At Wazito
        Coin, we are committed to providing exceptional service and empowering
        our users to unlock the full potential of the cryptocurrency revolution.
      </p>
          </div>
          <div className="news">
            <h2>Latest News</h2>
            <p>Stay updated with the latest news in the cryptocurrency world.</p>
          </div>
        </div>
      </main>
      <footer>
        <p>© 2024 Wazito Coin. All rights reserved.</p>
      </footer>
    </div>
  );
};

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button type="submit" className="login-btn">Login</button>
    </form>
  );
};

const SignUpForm = ({ onSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUp(username, password);
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button type="submit" className="signup-btn">Sign Up</button>
    </form>
  );
};

const Dashboard = ({ user, walletBalance }) => {
  return (
    <div className="dashboard">
      <h2>Welcome, {user || 'Guest'}!</h2>
      {user && <p>Wallet Balance: ${walletBalance}</p>}
      {/* Display user's balance, transactions, etc. */}
    </div>
  );
};

const BuySellPanel = () => {
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [cryptoType, setCryptoType] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);

  const handleBuySubmit = (e) => {
    e.preventDefault();
    // Handle buy cryptocurrency logic here
    console.log(`Buy ${buyAmount} ${cryptoType} to ${walletAddress}`);
  };

  const handleSellSubmit = (e) => {
    e.preventDefault();
    // Handle sell cryptocurrency logic here
    console.log(`Sell ${sellAmount} ${cryptoType} from ${walletAddress}`);
  };

  const toggleBuyForm = () => {
    setShowBuyForm(!showBuyForm);
  };

  const toggleSellForm = () => {
    setShowSellForm(!showSellForm);
  };

  return (
    <div className="buy-sell-panel">
      <h2>Buy/Sell Cryptocurrency</h2>
      <div className="buy-section">
        <h3>Buy Cryptocurrency</h3>
        <button onClick={toggleBuyForm}>
          {showBuyForm ? 'Hide Buy Form' : 'Show Buy Form'}
        </button>
        {showBuyForm && (
          <form onSubmit={handleBuySubmit}>
            <div>
              <label htmlFor="buy-amount">Amount:</label>
              <input
                type="number"
                id="buy-amount"
                value={buyAmount}
                onChange={(e) => setBuyAmount(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="crypto-type">Crypto Type:</label>
              <input
                type="text"
                id="crypto-type"
                value={cryptoType}
                onChange={(e) => setCryptoType(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="wallet-address">Wallet Address:</label>
              <input
                type="text"
                id="wallet-address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>
            <button type="submit">Buy</button>
          </form>
        )}
      </div>
      <div className="sell-section">
        <h3>Sell Cryptocurrency</h3>
        <button onClick={toggleSellForm}>
          {showSellForm ? 'Hide Sell Form' : 'Show Sell Form'}
        </button>
        {showSellForm && (
          <form onSubmit={handleSellSubmit}>
            <div>
              <label htmlFor="sell-amount">Amount:</label>
              <input
                type="number"
                id="sell-amount"
                value={sellAmount}
                onChange={(e) => setSellAmount(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="crypto-type">Crypto Type:</label>
              <input
                type="text"
                id="crypto-type"
                value={cryptoType}
                onChange={(e) => setCryptoType(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="wallet-address">Wallet Address:</label>
              <input
                type="text"
                id="wallet-address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>
            <button type="submit">Sell</button>
          </form>
        )}
      </div>
    </div>
  );
};
const handleNewUserMessage = (newMessage) => {
  console.log(`New message incoming! ${newMessage}`);
  // Here you can add your logic to handle the incoming message
  addResponseMessage("Sorry, I'm just a demo bot. I can't respond to messages.");
};



export default App;
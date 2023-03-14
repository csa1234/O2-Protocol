let initialize = () => {
        
    //Basic Actions Section
    const onboardButton = document.getElementById('connectButton');
  
    //Created check function to see if the MetaMask extension is installed
    const isMetaMaskInstalled = () => {
      //Have to check the ethereum binding on the window object to see if it's installed
      const { ethereum } = window;
      return Boolean(ethereum && ethereum.isMetaMask);
    };
  
    //------Inserted Code------\\
    const MetaMaskClientCheck = () => {
        //Now we check to see if Metmask is installed
        if (!isMetaMaskInstalled()) {
          //If it isn't installed we ask the user to click to install it
          onboardButton.innerText = 'Click here to install MetaMask!';
          //When the button is clicked we call this function
          onboardButton.onclick = onClickInstall;
          //The button is now disabled
          onboardButton.disabled = true;
        } else {
          //If it is installed we change our button text
          onboardButton.innerText = 'Connect';
        }
      };
      MetaMaskClientCheck();
}

  async function onConnect() {
    // Prompt user to connect their wallet
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  
    // Use the first account returned by MetaMask
    const account = accounts[0];
  
    // Set the account in web3

    web3.eth.defaultAccount = account;
    
    
  }

  async function buyTokens() {
    if (window.ethereum) {
      try {
        // Prompt user to connect Metamask to your Dapp and get selected address
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
  
        // Create a new Web3 instance using Metamask provider
        const web3 = new Web3(window.ethereum);
  
        // Contract address and ABI
        const contractAddress = "0xbdBF1aF9b3631D5ae2EF404f56E5a51aD0eA44e9";
        const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Start","type":"event"},{"anonymous":false,"inputs":[],"name":"Stop","type":"event"},{"inputs":[],"name":"TokenSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_forwardFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"claimVesting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"round","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"setNewOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_round","type":"uint256"}],"name":"setRound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setVesting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stopVesting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"supply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferToTreasury","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"vestingInfo","outputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"totalVestedTokens","type":"uint256"},{"internalType":"uint256","name":"dailyVestedTokens","type":"uint256"},{"internalType":"uint256","name":"claimAmount","type":"uint256"},{"internalType":"uint256","name":"claimtime","type":"uint256"},{"internalType":"bool","name":"claim24h","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingStart","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];
  
        // Create a new contract instance
        const contract = new web3.eth.Contract(abi, contractAddress);
  
        // Get the amount of tokens from the input field
        const amount = document.getElementById("_amount").value;
  
        // Get the rate from the contract
        const rate = await contract.methods.rate().call();
        
        //set rate value
        var currentRate;
        if (rate == 1) {
            currentRate = 0.65;
            
        } else if (rate == 2) {
            currentRate == 0.67;
           
        } else if (rate == 3) {
            currentRate == 0.69;

        }
  
        // Calculate the amount of tokens to purchase based on the rate
        const tokensToPurchase = (amount / currentRate);
  
        // Convert amount to wei
        const amountWei = web3.utils.toWei(amount, "ether");
  
        // show the standby modal
        $('#standbyModal').modal('show');
        

        // Send transaction to the contract
        const result = await contract.methods.buyTokens().send({
          from: account,
          value: amountWei

          
        });
        
        // hide the standby modal
        $('#standbyModal').modal('hide');
        // Hide the purchase modal
        $("#purchaseModal").modal("hide");

               

        // Display the success modal with the amount of tokens purchased
        $("#successAmount").text(tokensToPurchase.toFixed(8));
        $("#successModal").modal("show");

        
  
      } catch (error) {
        // Handle error
        console.error(error);
      }
    } else {
      // Metamask not found
      console.error("Metamask not found");
    }
  }
  
function purchaseTokens() {
  // Show the purchase modal
  $('#purchaseModal').modal('show');
}



var conexion = false;

// Connect to MetaMask
function connectMetaMask() {
    if (conexion == false){
        conexion = true;
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
            web3 = new Web3(window.ethereum);
            window.ethereum.request({ method: 'eth_requestAccounts' }).then(async function (accounts) {
                
                // Check if connected to Polygon network
                const networkId = await ethereum.request({ method: 'eth_chainId' });
                if (networkId == '0x89') {
                    action(accounts);
                }
                else {
                    // Add Polygon network if not already added
                    const chainData = {
                        chainId: '0x89',
                        chainName: 'Polygon',
                        nativeCurrency: {
                            name: 'MATIC',
                            symbol: 'MATIC',
                            decimals: 18
                        },
                        rpcUrls: ['https://polygon-rpc.com/'],
                        blockExplorerUrls: ['https://polygonscan.com/']
                    };

                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [chainData]
                    });

                    action(accounts);
                }
            })
        } 
    }
}




function action(accounts){
    // Store the connected account information in local storage
    localStorage.setItem("connectedAccount", accounts[0]);
    // Hide the connect button
    document.getElementById("connectButton").style.display = 'none';
    document.getElementById("connectButton2").style.display = 'none';
    // Show Disconnect button
    document.getElementById("disco").style.display = 'block';
                            
    // Define the vesting contract ABI and address
    const vestingAddress = "0xbdBF1aF9b3631D5ae2EF404f56E5a51aD0eA44e9";
    const vestingABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Start","type":"event"},{"anonymous":false,"inputs":[],"name":"Stop","type":"event"},{"inputs":[],"name":"TokenSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_forwardFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"claimVesting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"round","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"setNewOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_round","type":"uint256"}],"name":"setRound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"setVesting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stopVesting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"supply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferToTreasury","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"vestingInfo","outputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"totalVestedTokens","type":"uint256"},{"internalType":"uint256","name":"dailyVestedTokens","type":"uint256"},{"internalType":"uint256","name":"claimAmount","type":"uint256"},{"internalType":"uint256","name":"claimtime","type":"uint256"},{"internalType":"bool","name":"claim24h","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"vestingStart","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];
                       
    //// ------- REMOVER AL EMPEZAR SEED ROUND
    //document.querySelector('a.btn.secondary-btn[onclick="purchaseTokens()"]').style.display = "block";
    
    // Display the connected message and account address
    var account = document.getElementById("account");
    account.style.display = 'block';
    account.innerHTML = "Connected to: " + accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4);
    // Get the vesting contract instance
    const vestingContract = new web3.eth.Contract(vestingABI, vestingAddress);
    // Get the connected account's address
    const userAddress = accounts[0];
    // Call the vestingInfo function of the vesting contract, passing the user's address
    vestingContract.methods.vestingInfo(userAddress).call().then(function(info) {
    
        // Display the total vested tokens
    // ------- REMOVER AL EMPEZAR SEED ROUND
    const totalVestedTokens = web3.utils.fromWei(info.totalVestedTokens, "ether");
    if (totalVestedTokens === '0') {
        account.innerHTML += `<br>Total token O2PR purchased: 0`;
    } else {
        account.innerHTML += `<br>Total token O2PR purchased: ${totalVestedTokens}`;
    }

   // Call the TokenSold function of the vesting contract
    vestingContract.methods.TokenSold().call().then(function(TokenSold) {
    
    // ------- REMOVER AL EMPEZAR SEED ROUND
        // Display the TokenSold
    const TokenSoldInEther = web3.utils.fromWei(TokenSold, 'ether');
    const formattedTokenSold = parseFloat(TokenSoldInEther).toLocaleString('en-US', {maximumFractionDigits: 2});
    
    // Call the TotalAmount function of the vesting contract
    vestingContract.methods.TotalAmount().call().then(function(TotalAmount) {
        const TotalAmountInEther = web3.utils.fromWei(TotalAmount, 'ether');
        // Display the TotalAmount with commas for thousands
        const formattedTotalAmount = parseFloat(TotalAmountInEther).toLocaleString('en-US', {maximumFractionDigits: 2});
        //muestra valores TotalAmount
        account.innerHTML += `<br>Total tokens for sale: ${formattedTotalAmount}`;

        //muestra valores TokenSold
        account.innerHTML += `<br>Tokens sold: ${formattedTokenSold}`;
        
        // Calculate the percentage of tokens sold
        const percentageSold = parseFloat(TokenSoldInEther) * 100 / parseFloat(TotalAmountInEther);
        
        // Set the progress bar
        const progressBar = document.querySelector('.progress-bar');
        progressBar.setAttribute('aria-valuenow', percentageSold);
        progressBar.style.width = percentageSold;
        progressBar.dataset.transitiongoal = percentageSold;
        $('.progress').css('display', 'block');


        // Update progress text
        const progressText = document.getElementById('progressText');
        const formattedTokenAmount = parseFloat(TotalAmountInEther).toLocaleString('en-US', {maximumFractionDigits: 2});
        //OCULTAR BARRA Y TEXTO
        progressText.textContent = `${formattedTokenSold} of ${formattedTokenAmount} O2PR Token`;
        progressText.style.display = 'block';
    });
    });
    });

}

function disconnectMetaMask() {
    // Clear the connected account information from local storage
    conexion = false;
    localStorage.removeItem("connectedAccount");
  
    document.getElementById("disco").style.display = 'none';

    // Display the connect button
    document.getElementById("connectButton2").style.display = 'block';
  
    // Hide the connected message and account address
    var account = document.getElementById("account");
    account.style.display = 'none';

    document.querySelector('a.btn.secondary-btn[onclick="purchaseTokens()"]').style.display = 'none';
    document.getElementById("progressText").style.display = 'none';
    document.querySelector(".progress").style.display = 'none';
    document.getElementById("connectButton").style.display = "block";
  
    // Change the button back to display connect
    const connectButton = document.getElementById("connectButton2");
    connectButton.innerHTML = "Connect";
    connectButton.onclick = connectMetaMask;
  
  }
  
// Add an event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if web3 has been injected by the browser (Mist/MetaMask)
    if (web3 !== 'undefined') {
        // Use the web3 provider that has been injected
        web3 = new Web3(web3.currentProvider);
        if(web3.currentProvider.isMetaMask){
            console.log("MetaMask is already connected");
        }
        else{
            var button = document.getElementById("connectButton");
            button.style.display = 'block';
            button.addEventListener('click', function(){
                web3.currentProvider.enable().then(() => {
                    console.log('MetaMask is now connected')
                });
            });
        }
    } else {
        console.log('MetaMask is not installed')
    }
});
   
$(function () {

    var _window = $(window),
        _document = $(document),
        _body = $('body');

    //animated navbar-toggler button
    _document.on('click', '.navbar .navbar-toggler', function () {
        $(this).toggleClass("change");
    });

    _document.on('click', '.o-language .dropdown-toggle', function (e) {
        if (_window.width() < 768) {
            e.preventDefault();
            $(this).next('.dropdown-menu').slideToggle();
        }
    });

    // Define a translations object with the text in both English and Spanish
        const translations = {
            'en': {
            'top-features': 'Features',
            'top-products': 'Products',
            'top-roadmap': 'Roadmap',
            'top-about': 'About',
            'top-team': 'Team',
            'top-token': 'Token',
            'top-contact': 'Contact',
            'connect': 'Connect',
            'connectwallet':'CONNECT WALLET',
            'disconnect':'Disconnect',

            //video
            'intro-video-url': 'https://www.youtube.com/watch?v=sEMTHlAfMR4',
            
            //middle description
            'banner-title': 'Carbon Offset Financing & Leveraged Crypto farming De-Fi',
            'banner-description': 'Leveraged farming with carbon offset tokens generating money flow<br>income thru the financing of carbon offset projects certification & tokenization.',
            'whitepaper': 'WHITEPAPER',
            'intro-video': 'Intro Video',
            'financial-text1': 'SEED ROUND STARTS IN',
            //'PRIVATE ROUND A STARTS IN',
            //'PRIVATE ROUND B STARTS IN',

            'connectwallet':'CONNECT WALLET',
            'purchase-o2p':'PURCHASE O2PR TOKENS',
            
            //get whitelisted
            'getwhitelisted':'Get your access to the whitelist and receive in Airdrop 100 O2PR tokens (approx. value $100)',
            'toparticipate':'To participate on the Financial rounds & raffle airdrop, please complete next tasks:',
            'toparticipate2':'Retweet, like and share with 5 contacts <a href="https://twitter.com/o2_protocolDAO/status/1631017830215819264?s=20" target="_blank" rel="noopener noreferrer">  Twiter</a>',
            'toparticipate3':'Like and share with 5 contacts <a href="https://www.instagram.com/reel/CpQOeVdANUj/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer">  Instagram</a>',
            'toparticipate4':'Join our <a href="https://discord.gg/DxpFhzNr" target="_blank" rel="noopener noreferrer">  Discord</a>',
            'toparticipate5':'Join our <a href="https://t.me/+yB50AQTUJoozM2U5" target="_blank" rel="noopener noreferrer">  Telegram</a>',
            'toparticipate6':'To be able to participate on each financial round user must be whitelisted by completing above tasks<br>Raffle will go live on YouTube the days April 1st, April 20th, May 10th<br>Signup to our newsletter for further notice and alerts',
            
            //how to claim
            'howtoclaim':'How to claim your purchased tokens:',
            'howtoclaim2':'After all financial rounds end, you will be able to claim your purchased tokens at a vesting rate of 0.27% daily<br>While you receive your vesting tokens, you will also receive yield income from the staking vault for the locked remaining vested tokens',
            
            //how it works
            'howitworks':'How it works:',
            'stephow': 'O2-Protocol will finance CO2 projects certification thru NGO like Verra, Goldstandard or others, binded with a legal agreement with the project owner',
            'stephow2': 'Those certifications are then tokenized thru Toucan Protocol NFT or another tokenization bridging services',
            'stephow3': 'NFT is then converted to carbon offset tokens and swaped to USDT',
            'stephow4': 'O2-Protocol keeps 50% of the USDT and 50% goes to the project owner',
            'stephow5': '50% of the USDT is swaped to buy back O2PR token and remaining will be used to finance new projects certifcation and provide liquidity to the pools',
            
                
            //business model
            'business-model': 'BUSINESS MODEL',
            'o2p-token': 'O2PR TOKEN',

            'finance-carbon':'Finance of carbon offset certification projects. O2-Protocol keeps 50% of the face value of the certification at market prices in DEX',
            'finance-banner': 'FINANCE',
            'monetization-banner': 'MONETIZATION',
            'monetization-text': 'Tokenization of carbon offset certificates allowing instantly the swapping for other cryptocurrencies through decentralized exchangers (DEX).',
            'smart-text': 'Receive a proportional percentage on the amount of O2PR token you lock on O2-Protocol smartcontract. NFT owners will have access to exclusive and special financial benefits.',
            'smart-banner': 'SMART MANAGEMENT',

            'retire-text': 'Convert and retire your NFT carbon offset credits back into real world.',
            'retire-banner': 'RETIRE',

            'tokenization-text': 'O2-Protocol will manage certification process and tokenization of selected projects elected thru votation by smartcontract locked O2PR tokens holders .',
            'tokenization-banner':'TOKENIZATION',

            'farming-text': 'Profit revenues from O2-Protocol treasury will go to liquidity pools, which will become available to users for borrowing at premium discount for leverage farming.',
            'farming-banner':'LEVERAGED FARMING',

            'price-text': 'O2-Protocol will constantly create income from real world financial assets based on carbon offset certfications and buying back O2PR tokens from the market creating buy pressure, which translate to a higher O2PR price value.',
            'price-banner':'PRICE STRATEGY',

            'stake-text':'Lock your O2PR token on our smartcontract (stake) and receive a share of the platform overall income revenues and access to voting power on the platform proposals like projects selections and liquidity farming pools creation for the leveraged farming.',
            'stake-banner':'PASSIVE INCOME',

            //PRODUCT DETAILS
            'product-title':'Products Details',
            'product-text': 'Get to known more about our farming strategies,carbon offset projects types & aims.',
            'product-a':'PASSIVE INCOME',
            'product-b':'TOKENIZATION',
            'product-c':'FINANCING',

            'leverage-title':'Leveraged Yield Farming<br>Estimated APR between 20% - 200% on leveraged liquidity pools.',
            'leverage-text':'Liquidity pools tokens: Bitcoin, Ethereum, Matic, Litecoin, carbon offset tokens, stablecoins & O2PR tokens.',

            'tokenization-product-title':'Tokenization of carbon offset projects in Paraguay, Brazil, Argentina & Uruguay (MERCOSUR)<br>Reforestation & protection of forests',
            'tokenization-product-text':'With an strategic alliance with NGOs in the MERCOSUR, O2-Protocol will<br>work forward with land owners helping them aquiring carbon offset certifications and tokenization<br>helping those project owners generate revenues income on their reforestation and/or forest protection<br>thru our platform.',

            'financing-title':'Reforestations, Solar Panels & Wind power projects',
            'financing-text':'Partnership with Solar panels & wind power companies startup projects.<br>O2-Protocol will be able to finance them and become also a shareholder.<br>Hydroelectrics will also be in the aim thru special partnership agreement with country governments in the future.',

            //ROADMAP
            'roadmap-title':'Roadmap',
            'roadmap-description':'This is our 2023 roadmap, and its possible we agregate even more tasks thru the current year.',
            'roadmap1':'<span>April, 2023</span>SEED ROUND',
            'roadmap1-description': '● Seed Financial Round<br>● Private Sale A<br>● Private Sale B<br>● Legal status establishment',

            'roadmap2':'<span>May, 2023</span>PROJECT LAUNCH',
            'roadmap2-description': '● Leveraged DAPP<br>● Integration Crowdfunding platform DAPP<br>● Launchpad Carbon Offset Projects',

            'roadmap3':'<span>July, 2023</span>NFT MARKETPLACE & BRIDGE',
            'roadmap3-description': '● Carbon Offset NFT Marketplace<br>● Carbon Offset Tokenization Bridge<br>● Mobile APP',

            'roadmap4':'<span>November, 2023</span>LEGAL COMPLIANCE & KYC',
            'roadmap4-description': '● Soy, Rice, Wheat & Corn commodities tokenization<br>● KYC legal compliance<br>● Anti Money Laundry legal compliance<br>● Debit Card partnership',
            
            //ABOUT US
            'about1': 'About Us',
            'aboutus-description': 'O2-Protocol began as a conceptual idea at the beginning of 2020.<br><br>By 2021 O2-Protocol began a pre-incubation process with the National University of Asunción, Start-up Lab division, culminating the pre-incubation process in early 2022 after a long period of research in various areas such as marketing, finance, carbon offset market, agribusiness among other areas.<br><br>In mid-2022 we started the final incubation process.<br><br>This is the first time in the entire crypto world, where a DeFi project is combined with a real business model like carbon offset trading to generate a stream of income in the crypto environment.',
                                 
            //OPERATING TEAM
            'team-members':'Team members',
            'operating':'OPERATING TEAM',
            'cesar': 'Cesar is a lawyer and blockchain developer with over 12 years experience in laws and over<br>20 years in programming & stock exchange trades.',
            'cesar-title':'Cesar Saguier<span>CEO/CTO, Blockchain dev<br>Lawyer, Founder</span>',
            'maria':'>Maria Liz brings a solid portfolio of financial management and administrative experience.<br>She has vast experience in the field of laws & notary, as well as in administration and portfolio management.',
            'maria-title':'Maria Liz Galeano<span>Chief Financial Officer & Legal Advisor</span>',
            'ale':'Ale is a marketing stragist consultant and advisor, with a vast network of contacts at various levels internationally.<br>He has a Master of Science in engineering and management with more than 21 years.',
            'ale-title':'Alejandro Nuñez<span>Chief Strategy Officer<br>Marketing & Innovation</span>',
            'erika':'More than 20 years of professional experience as consultant & advisor.<br>Professional skils in the paradigm of sustainability, its environmental implications, sociocultural and economic at the regional level.',
            'erika-title':'Erika Beckelmann<span>Architect in Sustainable Environmental Management</span>',


            //100 MILLION
            '100million':'100 Millions O2PR Tokens',
            '100million-text':'The voluntary carbon offset market, which was worth about $2 billion in 2021, will grow to $10-40 billion in value by 2030',
            '100million-text2':'There will be no more than 100 millions O2PR tokens and with current market size of $2 billions<br> that is a 1:20 ratio, which translate to a $20 per token with current Carbon offset market cap.<br>O2PR will constanly add marketcap value thru the injection of new project certification and tokenization.',
            

            //TOKEN DISTRIBUTION
            'token-distribution':'Token Distribution',
            'token-distribution-text':'O2-Protocol will utilize a vesting model of 12 months for each financial round at an average of 8.33% monthly vesting to avoid price dump and pump fluctuations.<br><br>● Seed round: O2PR token price will be offered at 0.65 MATIC per 1 O2PR token<br>● Private Sale A: O2PR token price will be offered at 0.67 MATIC per 1 O2PR token<br>● Private Sale B: O2PR token price will be offered at 0.69 MATIC per 1 O2PR token',
            'tokentext1': 'Airdrop: 0.1%',
            'tokentext2': 'Development: 20%',
            'tokentext3': 'Liquidity Farming: 26%',
            'tokentext4': 'Seed, Private Sale A & B: 25%',
            'tokentext5': 'Team founder: 20%',
            'tokentext6': '>Marketing & Advisors: 8.9%',

            //MEDIUM BLOG
            'medium-title':'Latest Medium Blog Posts on O2-Protocol',
            'medium-text':'Keep up to date with the latest news on O2-Protocol.',
            
            'blog1':'<a href="#" data-toggle="modal" data-target="#blog-modal-content"><span>February, 24</span>REGENERATIVE DEFI</a>',
            'blog2':'<a href="#" data-toggle="modal" data-target="#blog-modal-content2"><span>February, 24</span>CARBON OFFSET NFT CERTIFICATES</a>',
            'blog3':'<a href="#" data-toggle="modal" data-target="#blog-modal-content3"><span>February, 24</span>LEVERAGED YIELD FARMING</a>',
            'medium-link':'READ MORE BLOG POSTS',

            //MODAL BLOG
            'modal1-text':'REGENERATIVE DEFI',
            'modal11-text':'A new concept in DeFi<br><br>We present to the world a new business model for Decentralized Finance that opens the doors to traditional business models to embark on the world of the crypto environment.<br><br>O2-Protocol focuses especially and exclusively on the market business model for carbon offsetting.<br><br>For this, I am going to explain in simple terms what this traditional business model consists of and how we take it to a crypto environment.<br><br>In the carbon offset market, factories and businesses are required to replenish the environment with the same amount of oxygen that they emit into the environment with greenhouse gases (CO2) by their factories or businesses.As a basic example: an aircraft factory in Germany releases carbon dioxide (CO2) when melting metals to make its aircraft.In order for this factory to continue operating due to government laws, it needs to demonstrate that the entire amount of CO2 emitted to the environment is compensated with O2 (oxygen) anywhere in the world. To do this, they use certificates for carbon compensation, these certificates confirm that in some part of the world, in a piece of land, X amount of oxygen is being produced, for X amount of trees, etc etc and many other data.The aircraft factory then searches these markets for holders or sellers of these certificates and thus present them to the regulatory government institutions in charge of controlling greenhouse gases, and thus be able to continue operating their business.<br><br>The next question is: who and where do these carbon credit certificates come from?… continue in the next blog',
            'modal1-date':'<a href="#">February, 24 2023</a><a href="#">O2-Protocol</a>',
            'modal2-date':'<a href="#">February, 24 2023</a><a href="#">O2-Protocol</a>',
            'modal3-date':'<a href="#">February, 24 2023</a><a href="#">O2-Protocol</a>',

            'modal2-text':'CARBON OFFSET NFT CERTIFICATES',
            'modal22-text':'Where to get carbon offset certificates and how, finally how to monetize them on the blockchain.<br>There are two types of market for greenhouse gas offsets:<br><br>Public: run by the governments of each country< br>Private: voluntary carbon offset.<br><br>Lets focus on voluntary (private) carbon offset:<br>There are several non-governmental organizations known as NGOs that are in charge of verifying and certifying offset projects of carbon.< br>The two most renowned and well-known in the voluntary carbon offset market are Verra.org and Goldstandard.org<br>When the owner of a rural property decides to reforest his land, he needs these NGOs to certify it. <br>These certifications are carried out via satellite and therefore the cost of certifying any carbon offset project is very high, ranging from $5,000 to $15,000 depending on various factors.<br><br>Once that the owner pays these amounts to these NGOs, receives his certificate and then has to put it up for sale on the voluntary carbon market.<br><br>But where does O2-Protocol come into all this? Well, O2-Protocol will finance 100% of the certification costs for all those owners who need it. Once the project is certified, O2-Protocol is in charge of tokenizing these certificates and taking them to the blockchain, where it can be instantly monetized by other cryptocurrencies and/or crypto assets, leaving the owner with 50% of the value of the certificate. and the other 50% of the value for O2-Protocol as a concept for having financed the project and managing its tokenization and monetization.<br><br>But this does not end there, the holder of these NFT certificates will have access together with other users who do not have NFTs to other exclusive benefits such as doing leveraged farming and generating passive income on the blockchain through O2-Protocol.<br><br>In the next blog, I will explain how...',
            'modal3-text':'LEVERAGE CRYPTO FARMING',
            'modal33-text':'O2-Protocol – Will generate passive income with leveraged crypto farming.<br>Users will have access to collateralized loans and the option to borrow their capital with collateralized collateral to receive passive income.<br><br>O2-Protocol will use a leveraged crypto farming fork based on Impermax, but unlike all DeFi on the market, O2-Protocol constantly generates a stream of money to liquidity pools through business models such as carbon offset financing, which creates buying pressure on O2-Protocol native token called O2PR token.<br>The function of the O2PR token will not only serve to pay loan fees, but will also have voting power for the election of the projects to be financed, choice for the creation of liquidity funds in leveraged cryptographic farming, it will also give you access to the profits of the platform itself proportionally based on the amount held and deposited in the smart contracts, and many other options.<br><br>O2-Protocol will benefit from each project it certifies, as most of the revenue will go towards adding more funds to Leverage liquidity pools for crypto farming which translates into higher appreciative value in the O2PR token market.',
            

            //LEAVE US MESSAGE
            'leave':'Leave us a meesage',
            'firstname':'First Name',
            'lastname':'Last Name',
            'phone':'Phone',
            'email':'e-mail',
            'message':'Message',
            'submit':'SUBMIT YOUR MESSAGE',

            //CONTACT US
            'contactus':'Contact Us',

            //NEWSLETTER
            'news-title':'Newsletter',
            'news-text':'Sign up for ICO campaign updates',
            'news-name':'Full Name',
            'news-email':'e-mail address',
            'news-submit':'SUBSCRIBE',



            //bottom
            'banner-feature': 'Features',
            'bottom-product': 'Products',
            'bottom-roadmap': 'Roadmap',
            'bottom-token': 'Token',
            'top-blog':'Blog',
            
            

            //MODAL PURCHASE
            'modal-purchase':'Purchase O2PR Tokens - Seed Round',
            'modal-purchase-text':'Enter amount in MATIC to buy O2PR<br>Current price: 0.45 MATIC per 1 token O2PR',
            'modal-purchase-button':'Purchase',
            'modal-purchase-cancel':'Cancel',
            'modal-purchase-sucessful':'',
            'modal-purchase-receipt':'You just purchased <span id="successAmount"></span> O2PR tokens.',
            'modal-close':'',



            },
            'es': {
            
            //top banners
            'top-features': 'Caract.',
            'top-products': 'Productos',
            'top-roadmap': 'Hoja de ruta',
            'top-about': 'Acerca',
            'top-team': 'Equipo',
            'top-token': 'Token',
            'top-blog':'Blog',
            'top-contact': 'Contacto',
            'connect': 'Conectar',
            'connectwallet':'CONECTAR BILLETERA',
            'disconnect':'Desconectar',

            //video
            'intro-video-url': 'https://www.youtube.com/watch?v=_WbSnw9zMhI',
            
            //middle description
            'banner-title': 'Financiación de Compensación de Carbono y Agricultura Criptográfica apalancada De-Fi<br>Finanzas Descentralizadas',
            'banner-description': 'Agricultura criptográfica apalancada con tokens de compensación de carbono que generan flujo de dinero e ingresos a través <br>de la financiación de la certificación y tokenización de proyectos de compensación de carbono.',
            'whitepaper': 'WHITEPAPER',
            'intro-video': 'Video de Introducción',
            'financial-text1': 'RONDA SEMILLA EMPIEZA EN',
            // 'RONDA PRIVADA A EMPIEZA EN',
            // 'RONDA PRIVADA B EMPIEZA EN',

            'connectwallet':'CONECTAR BILLETERA',
            'purchase-o2p':'COMPRAR TOKEN O2PR',

            //get whitelisted
            'getwhitelisted':'Obtenga su acceso a la lista blanca y reciba en Airdrop 100 tokens O2PR (valor aproximado de $ 100)',
            'toparticipate':'Para participar en las rondas financieras y lanzamiento aéreo de rifas, complete las siguientes tareas:',
            'toparticipate2':'Retuitea, dale me gusta y comparte con 5 contactos <a href="https://twitter.com/o2_protocolDAO/status/1631017592851660802?s=20" target="_blank" rel="noopener noreferrer"> Twiter</a>',
            'toparticipate3':'Dale me gusta y compartir con 5 contactos <a href="https://www.instagram.com/reel/CpQOlA9Asdp/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer"> Instagram</a>',
            'toparticipate4':'Únete a nuestro canal en <a href="https://discord.gg/DxpFhzNr" target="_blank" rel="noopener noreferrer">  Discord</a>',
            'toparticipate5':'Únete a nuestro canal en <a href="https://t.me/+yB50AQTUJoozM2U5" target="_blank" rel="noopener noreferrer">  Telegram</a>',
            'toparticipate6':'Para poder participar en cada ronda financiera, el usuario debe estar en la lista blanca completando las tareas anteriores<br>La rifa se lanzará en YouTube los días 1 de abril, 20 de abril y 10 de mayo<br>Suscríbase a nuestro boletín para recibir más avisos y alertas',
            
            //how to claim
            'howtoclaim':'Cómo reclamar sus tokens comprados:',
            'howtoclaim2':'Después de que finalicen todas las rondas financieras, podrá reclamar sus tokens comprados a una tasa de adquisición del 0,27% diario<br>Mientras recibe sus tokens adquiridos, también recibirá ingresos de rendimiento de la bóveda de participación para los tokens adquiridos restantes que sigan bloqueados.',
            
            //how it works
            'howitworks':'Como funciona:',
            'stephow': 'O2-Protocol financiará la certificación de proyectos de CO2 a través de ONG como Verra, Goldstandard u otros, vinculado a un acuerdo legal con el propietario del proyecto',
            'stephow2': 'Las certificaciones luego se tokenizan a través del Protocolo Toucan NFT u otros similares',
            'stephow3': 'Los NFT luego se convierten en token de compensación de carbono y se intercambian a USDT',
            'stephow4': 'O2-Protocol se queda con el 50% del USDT en concepto por haber financiado la certificacion y tokenización, el otro 50% va al propietario del proyecto',
            'stephow5': 'Los beneficios obtenidos se distribuirán en las piscinas de liquidez, financiación de nuevos proyectos, caja de tesorería, pago de salarios y marketing',

            //business model
            'business-model': 'MODELO DE NEGOCIO',
            'o2p-token': 'TOKEN O2PR',

            'finance-carbon': 'Financiación de certificación de proyectos de compensación de carbono. O2-Protocol se queda con el 50 % del valor nominal de la certificación al precio del mercado en los DEX',
            'finance-banner': 'FINANZAS',
            'monetization-banner': 'MONETIZACIÓN',
            
            'monetization-text': 'Tokenización de certificados de compensación de carbono que permite el intercambio instantáneo por otras criptomonedas a través de cambistas descentralizados (DEX).',
            'smart-text': 'Reciba un porcentaje proporcional sobre la cantidad de token O2PR que bloquea en el contrato inteligente O2-Protocol. Los propietarios de NFT tendrán acceso a beneficios financieros exclusivos y especiales.',
            'smart-banner': 'GESTIÓN INTELIGENTE',

            'retire-text': 'Convierta y retire sus créditos de compensación de carbono NFT de vuelta al mundo real.',
            'retire-banner': 'RETIRO',


            'tokenization-text': 'O2-Protocol gestionará el proceso de certificación y tokenización de proyectos seleccionados elegidos mediante votación por titulares de tokens O2PR bloqueados por contrato inteligente.',
            'tokenization-banner':'TOKENIZACIÓN',

            'farming-text': 'Los ingresos por ganancias de la tesorería de O2-Protocol se destinarán a fondos de liquidez, que estarán disponibles para que los usuarios tomen préstamos con un descuento premium para apalancar la agricultura criptográfica.',
            'farming-banner':'GANANCIAS APALANCADAS',

            'price-text': 'O2-Protocol creará constantemente ingresos a partir de activos financieros del mundo real basados ​​en certificaciones de compensación de carbono y la recompra de tokens O2PR del mercado creando presión de compra, lo que se traduce en un valor de precio O2PR más alto.',
            'price-banner':'ESTRATEGIA DE PRECIO',

            'stake-text':'Bloquee su token O2PR en nuestro contrato inteligente (participación) y reciba una parte de los ingresos generales de la plataforma y acceso al poder de voto en las propuestas de la plataforma, como selecciones de proyectos y creación de fondos de agricultura de liquidez para la agricultura apalancada.',
            'stake-banner':'INGRESOS PASIVOS',

            'product-title':'Detalles de productos',
            'product-text': 'Conozca más sobre nuestras estrategias agrícolas, tipos de proyectos de compensación de carbono y objetivos.',
            'product-a':'INGRESOS PASIVOS',
            'product-b':'TOKENIZACIÓN',
            'product-c':'FINANCIACIÓN',


            'leverage-title':'Agricultura criptográfica con rendimiento apalancado<br>APR estimado entre 20 % y 200 % en fondos de liquidez apalancados.',
            'leverage-text':'Tokens de fondos de liquidez: Bitcoin, Ethereum, Matic, Litecoin, tokens de compensación de carbono, monedas estables y tokens O2PR.',

            'tokenization-product-title':'Tokenización de proyectos de compensación de carbono en Paraguay, Brasil, Argentina y Uruguay (MERCOSUR)<br>Reforestación y protección de bosques',
            'tokenization-product-text':'Con una alianza estratégica con ONG en el MERCOSUR, O2-Protocol<br>trabajará con los propietarios de tierras ayudándolos a adquirir certificaciones de compensación de carbono y tokenización<br>ayudando a los propietarios de proyectos a generar ingresos en su reforestación y/o protección forestal< br>a través de nuestra plataforma.',

            'financing-title':'Reforestaciones, Paneles Solares y Proyectos Eólicos',
            'financing-text':'Asociación con proyectos de puesta en marcha de empresas de paneles solares y energía eólica.<br>O2-Protocol podrá financiarlos y convertirse también en accionista.<br>La energía hidroeléctrica también estará en el objetivo a través de un acuerdo de asociación especial con los gobiernos de los países en el futuro.',

            //ROADMAP
            'roadmap-title':'Hoja de ruta',
            'roadmap-description':'Esta es nuestra hoja de ruta para 2023 y es posible que agreguemos aún más tareas hasta el año en curso.',
            'roadmap1':'<span>Abril, 2023</span>RONDA FINANCIERA: SEMILLA',
            'roadmap1-description': '● Ronda Financiera Semilla <br>● Venta privada A<br>● Venta Privada B<br>● Establecimiento de la personería jurídica',

            'roadmap2':'<span>Mayo, 2023</span>LANZAMIENTO DEL PROYECTO',
            'roadmap2-description': '● DAPP apalancado<br>● Integración Plataforma de Crowdfunding<br>● Plataforma de lanzamiento de proyectos de Compensación de Carbono',

            'roadmap3':'<span>Julio, 2023</span>MERCADO DE NFT Y PUENTE DE TOKENIZACIÓN',
            'roadmap3-description': '● Mercado NFT de compensación de carbono<br>● Puente de tokenización de compensación de carbono<br>● APLICACIÓN móvil',

            'roadmap4':'<span>Noviembre, 2023</span>CUMPLIMIENTO LEGAL Y KYC',
            'roadmap4-description': '● Tokenización de materias primas de soya, arroz, trigo y maíz<br> ● Cumplimiento legal de KYC<br> ● Cumplimiento legal contra el lavado de dinero<br> ● Tarjeta de débito',


            //ABOUT US
            'about1': 'Sobre nosotros',
            'aboutus-description': 'O2-Protocol comenzó como una idea conceptual a principios de 2020.<br><br>Para 2021 O2-Protocol inició un proceso de pre-incubación con la Universidad Nacional de Asunción, división Start-up Lab, culminando el proceso de pre-incubación a principios de 2022 tras un largo periodo de investigación en varias áreas como marketing, finanzas, mercado de compensación de carbono, negocios agrícolas entre otras áreas.<br><br>A mediados de 2022 comenzamos el proceso de final de incubación y la etapa de resultado final es ahora.<br><br>Esta es la primera vez en todo el mundo criptográfico, donde un proyecto DeFi se combina con un modelo comercial real como el comercio de compensación de carbono para generar un flujo de ingresos en el entorno criptográfico.',

            //OPERATING TEAM
            'team-members':'Miembros del equipo',
            'operating':'EQUIPO OPERATIVO',
            'cesar': 'Cesar es abogado y desarrollador de blockchain con más de 12 años de experiencia en leyes y más de 20 años en programación y operaciones bursátiles.',
            'cesar-title':'Cesar Saguier<span>CEO/CTO, Dev. de Blockchain<br>Abogado, Fundador</span>',
            'maria':'Maria Liz aporta un sólido portafolio de gestión financiera y experiencia administrativa.<br>Cuenta con vasta experiencia en el campo de leyes y notariado, así como en administración y manejo de portafolios.',
            'maria-title':'Maria Liz Galeano<span>Directora Financiera y Asesora Legal</span>',
            'ale':'Ale es consultor y asesor estratega de marketing, con una vasta red de contactos en varios niveles a nivel internacional.<br>Tiene una Maestría en Ciencias en ingeniería y administración con más de 21 años.',
            'ale-title':'Alejandro Nuñez<span>Director de Estrategia<br>Marketing e Innovación</span>',
            'erika':'Más de 20 años de experiencia profesional como consultor & asesor.<br>Competencias profesionales en el paradigma de la sustentabilidad, sus implicaciones ambientales, socioculturales y económicas a nivel regional.',
            'erika-title':'Erika Beckelmann<span>Arquitecta en Gestión Ambiental Sostenible</span>',

            //100 MILLION
            '100million':'100 millones de tokens O2PR',
            '100million-text':'El mercado voluntario de compensación de carbono, que valía alrededor de $ 2 mil millones en 2021, crecerá a $ 10-40 mil millones en valor para 2030',
            '100million-text2':'No habrá más de 100 millones de tokens O2PR y con un tamaño de mercado actual de $ 2 mil millones<br> que es una proporción de 1:20, lo que se traduce en $ 20 por token con la capitalización actual de mercado de compensación de carbono.<br> O2PR agregará constantemente valor de capitalización de mercado a través de la inyección de nueva certificación y tokenización de proyectos.',

            //TOKEN DISTRIBUTION
            'token-distribution':'Distribución de tokens',
            'token-distribution-text':'O2-Protocol utilizará un modelo de adjudicación de 12 meses para cada ronda de financiación, con un promedio de 8,33 % de adjudicación mensual para evitar la presión de venta.<br><br> ● Ronda semilla: el precio del token O2PR se ofrecerá a 0.65 MATIC por 1 O2PR token<br>● Venta privada A: el precio del token O2PR se ofrecerá a 0.67 MATIC por 1 O2PR token<br>● Venta privada B: el precio del token O2PR se ofrecerá a 0.69 MATIC por 1 O2PR token',
            'tokentext1': 'Airdrop: 0.1%',
            'tokentext2': 'Desarrollo: 20%',
            'tokentext3': 'Fondo de liquidez para agricultura criptográfica',
            'tokentext4': 'Ronda Semilla, Venta Privada A y B: 25%',
            'tokentext5': 'Equipo Fundador: 20%',
            'tokentext6': 'Marketing y Asesores: 8,9%',

            //MEDIUM BLOG
            'medium-title':'Últimas publicaciones Medium en O2-Protocol',
            'medium-text':'Manténgase al día con las últimas noticias sobre O2-Protocol.',
            
            'blog1':'<a href="#" data-toggle="modal" data-target="#blog-modal-content"><span>Febrero, 24 2023</span>DEFI REGENERATIVO</a>',
            'blog2':'<a href="#" data-toggle="modal" data-target="#blog-modal-content2"><span>Febrero, 24 2023</span>NFT DE COMPENSACIÓN DE CARBONO</a>',
            'blog3':'<a href="#" data-toggle="modal" data-target="#blog-modal-content3"><span>Febrero, 24 2023</span>AGRICULTURA DE RENDIMIENTO APALANCADO</a>',
                        
            'medium-link':'LEA MÁS PUBLICACIONES DEL BLOG',

            //MODAL BLOG
            'modal1-text':'DEFI REGENERATIVO',
            'modal11-text':'Un nuevo concepto en DeFi<br><br>Presentamos al mundo un nuevo modelo de negocio para las Finanzas Descentralizadas que abre las puertas a los modelos de negocio tradicionales para embarcarse en el mundo del entorno criptográfico.<br><br>O2-Protocol se centra especial y exclusivamente en el modelo de negocio de mercado para la compensación de carbono.<br><br>Para ello, voy a explicar de forma sencilla en qué consiste este modelo de negocio tradicional y cómo lo llevamos a un entorno criptográfico.<br> <br>En el mercado de compensación de carbono, las fábricas y empresas deben reponer el medio ambiente con la misma cantidad de oxígeno que emiten al medio ambiente con gases de efecto invernadero (CO2) por sus fábricas o negocios. Como ejemplo básico: una fábrica de aviones en Alemania libera dióxido de carbono (CO2) al fundir metales para fabricar sus aviones. Para que esta fábrica siga funcionando debido a las leyes gubernamentales, debe demostrar que toda la cantidad de CO2 emitida al medio ambiente se compensa con O2 (oxígeno) en algún lugar del mundo. Para ello utilizan certificados de compensación de carbono, estos certificados confirman que en alguna parte del mundo, en un inmueble, se está produciendo X cantidad de oxígeno, para X cantidad de árboles, etc etc y muchos otros datos. Luego, la fábrica de aeronaves busca en estos mercados a los titulares o vendedores de estos certificados y así presentarlos a las instituciones gubernamentales reguladoras encargadas de controlar los gases de efecto invernadero, y así poder continuar operando su negocio.<br><br>La siguiente pregunta es: ¿de quién y de dónde vienen estos certificados de créditos de carbono?… continúa en el próximo blog.',
            'modal1-date':'<a href="#">Febrero, 24 2023</a><a href="#">O2-Protocol</a>',
            'modal2-date':'<a href="#">Febrero, 24 2023</a><a href="#">O2-Protocol</a>',
            'modal3-date':'<a href="#">Febrero, 24 2023</a><a href="#">O2-Protocol</a>',

            'modal2-text':'CERTIFICADOS NFT DE COMPENSACIÓN DE CARBONO',
            'modal22-text':'Dónde obtener certificados de compensación de carbono y cómo, por último cómo monetizarlos en la cadena de bloques.<br>Existen dos tipos de mercado para la compensación de gases de efecto invernadero:<br><br>Público: administrado por los gobiernos de cada país< br>Privado: compensación de carbono voluntaria.<br><br>Centrémonos en la compensación de carbono voluntaria (privada):<br>Hay varias organizaciones no gubernamentales conocidas como ONG que se encargan de verificar y certificar proyectos de compensación de carbono.< br>Los dos más renombrados y conocidos en el mercado voluntario de compensación de carbono son Verra.org y Goldstandard.org<br>Cuando el propietario de un inmueble rural decide reforestar su tierra, necesita que estas ONG lo certifiquen.<br>Estas certificaciones se llevan a cabo vía satélite y, por lo tanto, el costo de certificar cualquier proyecto de compensación de carbono es muy alto, oscilando entre $5,000 y $15,000 dependiendo de varios factores.<br><br>Una vez que el propietario paga estos montos a estas ONG, recibe su certificado y luego tiene que ponerlo a la venta en el mercado voluntario de carbono.<br><br>¿Pero dónde entra O2-Protocol en todo esto? Pues bien, O2-Protocol financiará el 100% de los costes de certificación para todos aquellos propietarios que lo necesiten. Una vez certificado el proyecto, O2-Protocol se encarga de tokenizar estos certificados y llevarlos a la cadena de bloques, donde puede ser monetizado instantáneamente por otras criptomonedas y/o cripto activos, dejando al propietario con el 50% del valor del certificado. y el otro 50% del valor por O2-Protocol como concepto por haber financiado el proyecto y gestionar su tokenización y monetización.<br><br>Pero esto no acaba ahí, el titular de estos certificados NFT tendrá acceso en conjunto con otros usuarios que no tienen NFT a otros beneficios exclusivos, como hacer agricultura apalancada y generar ingresos pasivos en la cadena de bloques a través de O2-Protocol.<br><br>En el próximo blog, explicaré cómo…',

            'modal3-text':'AGRICULTURA CRIPTOGRÁFICA APALANCADA',
            'modal33-text':'O2-Protocol: generará ingresos pasivos con agricultura criptográfica apalancada.<br>Los usuarios tendrán acceso a préstamos colateralizados y la opción de ofrecer en préstamo su capital con garantías colateralizadas y así recibir ingresos pasivos.<br><br>O2-Protocol utilizará una bifurcación de agricultura criptográfica apalancada basada en el Impermax , pero a diferencia de todas las DeFi en el mercado, O2-Protocol genera constantemente un flujo de dinero a los fondos de liquidez a través de modelos comerciales como la financiación de la certificación de compensación de carbono, lo que crea presión de compra sobre el token nativo de O2-Protocol llamado token O2PR.<br>La función del token O2PR no solo servirá para pagar las comisiones de los préstamos, sino que también tendrá poder de voto para la elección de los proyectos a financiar, elección para la creación de fondos de liquidez en la agricultura criptográfica apalancada, además le dará acceso a las ganancias de la propia plataforma proporcionalmente según el monto retenido y depositado en los contratos inteligentes, y muchas otras opciones más.<br><br>O2-Protocol se beneficiara de cada proyecto que certifica, ya que la mayor parte de los ingresos se destinarán para agregar más fondos a las piscinas de liquidez apalancadas para la agricultura criptográfica lo que se traduce en mayor valor apreciativo en el mercado del token O2PR.',

            //LEAVE US MESSAGE
            'leave':'Déjanos un mensaje',
            'firstname':'Nombre',
            'lastname':'Apellido',
            'phone':'Teléfono',
            'email':'e-mail',
            'message':'Mensaje',
            'submit':'ENVÍE SU MENSAJE',

            //CONTACT US
            'contactus':'Contacta con nosotros',

            //NEWSLETTER
            'news-title':'Boletin informativo',
            'news-text':'Regístrese para recibir actualizaciones de la campaña ICO',
            'news-name':'Nombre',
            'news-email':'e-mail',
            'news-submit':'SUSCRIBIR',

            //bottom
            'company-title':'O2-PROTOCOL',
            'about-bottom':'Acerca de',
            'team-bottom':'Equipo',
            'blog-bottom':'Blog',
            'contact-bottom':'Contacto',

            'ico-funding':'FINANCIACIÓN ICO',
            'bottom-feature': 'Características',
            'bottom-product': 'Productos',
            'bottom-roadmap': 'Hoja de ruta',
            'bottom-token':'Token',
            


            },
            'pr': {
                
                //top banners
                'top-features': 'Caract.',
                'top-products': 'Produtos',
                'top-roadmap': 'Roteiro',
                'top-about': 'Sobre',
                'top-team': 'Equipe',
                'top-token': 'Token',
                'top-blog':'Blog',
                'top-contact': 'Contato',
                'connect': 'Conectar',
                'connectwallet':'CONECTAR CARTEIRA',
                'disconnect':'Desconectar',

                //video
                'intro-video-url': 'https://www.youtube.com/watch?v=Pfe7tyapJ3A',
                
                //middle description
                'banner-title': 'Finanças de Compensação de Carbono e Agricultura de Criptografia alavancada De-Fi<br>Finanças descentralizadas',
                'banner-description': 'Agricultura de criptografia alavancada com tokens de compensação de carbono gerando fluxo de dinheiro receita através do financiamento de certificação e tokenização de projetos de compensação de carbono.',
                'whitepaper': 'WHITEPAPER',
                'intro-video': 'Vídeo de introdução',
                'financial-text1': 'RODADA DE SEMENTES COMEÇA EM',
                //'RODADA A PRIVADA COMEÇA EM',
                //'RODADA B PRIVADA COMEÇA EM',

                'connectwallet':'CONECTAR CARTEIRA',
                'purchase-o2p':'COMPRAR TOKENS O2PR',

                //get whitelisted
                'getwhitelisted':'Obtenha seu acesso à lista de permissões e receba no Airdrop 100 tokens O2PR (aprox. valor $ 100)',
                'toparticipate':'Para participar das rodadas financeiras e airdrop do sorteio, conclua as próximas tarefas:',
                'toparticipate2':'Retuíte, curta e compartilhe com 5 contatos <a href="https://twitter.com/o2_protocolDAO/status/1631017830215819264?s=20" target="_blank" rel="noopener noreferrer"> Twiter</a>',
                'toparticipate3':'Curta e compartilhe com 5 contatos do <a href="https://www.instagram.com/reel/CpQOeVdANUj/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer">Instagram</a>',
                'toparticipate4':'Junte-se ao nosso canal no <a href="https://discord.gg/DxpFhzNr">Discord</a>',
                'toparticipate5':'Junte-se ao nosso canal no <a href="https://t.me/+yB50AQTUJoozM2U5">Telegram</a>',
                'toparticipate6':'Para poder participar de cada rodada financeira, o usuário deve estar na lista de permissões concluindo as tarefas acima<br>O sorteio será lançado no YouTube nos dias 1º de abril, 20 de abril e 10 de maio<br>Inscreva-se em nosso boletim informativo para mais avisos e alertas',
                    
                //how to claim
                'howtoclaim':'Como reivindicar seus tokens comprados:',
                'howtoclaim2':'Depois que todas as rodadas financeiras terminarem, você poderá reivindicar seus tokens comprados a uma taxa de aquisição diária de 0,27%.<br>Enquanto você recebe seus Tokens Adquiridos, você também receberá receita de desempenho do Cofre da Estaca por quaisquer Tokens Adquiridos restantes que ainda estiverem bloqueados.',
                
                //how it works
                'howitworks':'Como funciona:',
                'stephow': 'O2-Protocol financiará a certificação de projetos de CO2 através de ONGs como Verra, Goldstandard ou outras, vinculadas a um acordo legal com o proprietário do projeto',
                'stephow2': 'As certificações são então tokenizadas através do protocolo Toucan NFT ou outros similares',
                'stephow3': 'NFTs são então convertidos em tokens de compensação de carbono e trocados por USDT',
                'stephow4': 'O2-Protocol fica com 50% do USDT por ter financiado a certificação e tokenização, os outros 50% vão para o dono do projeto',
                'stephow5': 'Os lucros obtidos serão distribuídos nos pools de liquidez, financiamento de novos projetos, caixa do tesouro, pagamento de salários e marketing',
                    
                //business model
                'business-model': 'MODELO DE NEGÓCIOS',
                'o2p-token': 'TOKEN O2PR',

                'finance-carbon': 'Financiamento de cert carbono. O2-Protocol fica com 50% do valor nominal do certificação a preço de mercado em DEX',
                'finance-banner': 'FINANÇA',
                'monetization-banner': 'MONETIZAÇÃO',
                'monetization-text': 'Tokenização de certificados de compensação de carbono que permite a troca instantânea por outras criptomoedas por meio de trocadores descentralizados (DEXs).',
                'smart-text': 'Receba uma porcentagem proporcional sobre a quantidade de token O2PR que você bloqueia no contrato inteligente O2-Protocol. Proprietários de NFT terão acesso a benefícios financeiros exclusivos e especiais.',
                'smart-banner': 'GESTÃO INTELIGENTE',

                'retire-text': 'Converta e retire seus créditos de compensação de carbono NFT de volta ao mundo real.',
                'retire-banner': 'RETIRADA',



                'tokenization-text': 'O2-Protocol gerenciará o processo de certificação e tokenização de projetos selecionados eleitos por meio de votação por detentores de tokens O2PR bloqueados por contrato inteligente.',
                'tokenization-banner':'TOKENIZAÇÃO',

                'farming-text': 'As receitas de lucro da tesouraria O2-Protocol irão para pools de liquidez, que ficarão disponíveis aos usuários para empréstimos com desconto premium para alavancar o cultivo de criptomoedas.',
                'farming-banner':'LUCROS ALAVANADOS',

                'price-text': 'O2-Protocol criará constantemente receita de ativos financeiros do mundo real com base em certificações de compensação de carbono e recomprando tokens O2PR do mercado, criando pressão de compra, que se traduz em um valor de preço O2PR mais alto.',
                'price-banner':'ESTRATÉGIA DE PREÇOS',

                'stake-text':'Bloqueie seu token O2PR em nosso contrato inteligente (aposta) e receba uma parte das receitas gerais da plataforma e acesso ao poder de voto nas propostas da plataforma, como seleções de projetos e criação de pools de agricultura de liquidez para a agricultura alavancada.',
                'stake-banner':'INGRESSOS PASSIVOS',


                'product-title':'Detalhes dos produtos',
                'product-text': 'Conheça mais sobre nossas estratégias agrícolas, tipos e objetivos de projetos de compensação de carbono.',
                'product-a':'INGRESSOS PASSIVOS',
                'product-b':'TOKENIZAÇÃO',
                'product-c':'FINANCIAMENTO',


                'leverage-title':'Cultivo de criptografia de rendimento alavancado<br> APR estimado entre 20% e 200% em pools de liquidez alavancados.',
                'leverage-text':'Tokens de pools de liquidez: Bitcoin, Ethereum, Matic, Litecoin, tokens de compensação de carbono, stablecoins e tokens O2PR.',

                'tokenization-product-title':'Tokenização de projetos de compensação de carbono no Paraguai, Brasil, Argentina e Uruguai (MERCOSUL)<br>Reflorestamento e proteção de florestas',
                'tokenization-product-text':'Com uma aliança estratégica com ONGs no MERCOSUL, O2-Protocol<br>trabalhará adiante com os proprietários de terras, ajudando-os a adquirir certificações de compensação de carbono e tokenização<br>ajudando os proprietários de projetos a gerar receita com seu reflorestamento e/ou proteção florestal< br>através da nossa plataforma.',

                'financing-title':'Projetos de reflorestamento, painéis solares e energia eólica',
                'financing-text':'Parceria com projetos de inicialização de empresas de painéis solares e energia eólica.<br>O2-Protocol poderá financiá-los e também se tornar um acionista.<br>As hidrelétricas também estarão no objetivo por meio de um acordo de parceria especial com os governos dos países no futuro.',

                //ROADMAP
                'roadmap-title':'Roteiro',
                'roadmap-description':'Este é o nosso roteiro para 2023, e é possível que agreguemos ainda mais tarefas ao longo deste ano.',
                'roadmap1':'<span>Abril, 2023</span>RODADA FINANCEIRA: SEMENTE',
                'roadmap1-description': '● Rodada Financeira Semente<br>● Venda Privada A<br>● Venda Privada B<br>● Estabelecimento de status legal',

                'roadmap2':'<span>Maio de 2023</span>LANÇAMENTO DO PROJETO',
                'roadmap2-description': '● DAPP alavancado<br>● Integração da plataforma de crowdfunding<br>● Plataforma para lançamento de projetos de compensação de carbono',

                'roadmap3':'<span>Julho de 2023</span>MERCADO NFT E PONTE DE TOKENIZAÇÃO',
                'roadmap3-description': '● Mercado NFT de compensação de carbono<br>● Ponte de tokenização de compensação de carbono<br>● APLICATIVO móvel',

                'roadmap4':'<span>Novembro de 2023</span>CONFORMIDADE LEGAL E KYC',
                'roadmap4-description': '● Tokenização de commodities de soja, arroz, trigo e milho<br>● Conformidade legal KYC<br>● Conformidade legal antilavagem de dinheiro<br>● Cartão de débito',

                //ABOUT US
                'about1': 'Sobre nós',
                'aboutus-description': 'O2-Protocol começou como uma ideia conceitual no início de 2020.<br><br>Em 2021, O2-Protocol iniciou um processo de pré-incubação com a Universidade Nacional de Assunção, divisão de Start-up Lab, culminando no processo de pré-incubação no início de 2022 após um longo período de pesquisa em diversas áreas como marketing, finanças, mercado de compensação de carbono, agronegócio entre outras áreas.<br><br>Em meados de 2022 iniciamos o processo final de incubação.<br><br> Esta é a primeira vez em todo o mundo criptográfico, onde um projeto DeFi é combinado com um modelo de negócios real, como o comércio de compensação de carbono, para gerar um fluxo de renda no ambiente criptográfico.',
                
                //OPERATING TEAM
                'team-members':'Membros do time',
                'operating':'EQUIPE OPERACIONAL',
                'cesar': 'Cesar é um advogado e desenvolvedor de blockchain com mais de 12 anos de experiência em leis e mais de<br>20 anos em programação e operações de bolsa de valores.',
                'cesar-title':'Cesar Saguier<span>CEO/CTO, Blockchain dev<br>Advogado, Fundador</span>',
                'maria':'Maria Liz traz consigo um forte portefólio de gestão financeira e experiência administrativa.<br>Tem uma vasta experiência na área jurídica e notarial, bem como em administração e gestão de carteiras.',
                'maria-title':'Maria Liz Galeano<span>Diretora Financeira e Assessora Jurídica</span>',
                'ale':'Ale é um consultor e conselheiro estratégico de marketing, com uma vasta rede de contactos a vários níveis a nível internacional.<br>Tem um Master of Science em engenharia e gestão com mais de 21 anos.',
                'ale-title':'Alejandro Nuñez<span>Diretor de Estratégia<br>Marketing e Inovação</span>',
                'erika':'Mais de 20 anos de experiência profissional como consultor & assessor.<br>Competências profissionais no paradigma da sustentabilidade, suas implicações ambientais, socioculturais e económicas a nível regional.',
                'erika-title':'Erika Beckelmann<span>Arquiteta em Gestão Ambiental Sustentável</span>',

                //100 MILLION
                '100million':'100 milhões de tokens O2PR',
                '100million-text':'O mercado voluntário de compensação de carbono, que valia cerca de US$ 2 bilhões em 2021, crescerá para US$ 10-40 bilhões em valor até 2030',
                '100million-text2':'Não haverá mais de 100 milhões de tokens O2PR e com tamanho de mercado atual de US$ 2 bilhões<br> ou seja, uma proporção de 1:20, que se traduz em US$ 20 por token com valor de mercado de compensação de carbono atual.<br>O2PR aumentará constantemente valor de mercado por meio da injeção de certificação e tokenização de novos projetos.',

                   
                //TOKEN DISTRIBUTION
                'token-distribution':'Distribuição de tokens',
                'token-distribution-text':'O2-Protocol usará um modelo de alocação de 12 meses para cada rodada de financiamento, com uma média de alocação mensal de 8,33% para evitar a pressão de venda.<br><br> ● Rodada inicial: o preço do token O2PR será oferecido a 0.65 MATIC por 1 O2PR token<br> ● Venda privada A: o preço do token O2PR será oferecido a 0.67 MATIC por 1 O2PR token<br>● Venda privada B: o preço do token O2PR será oferecido a 0.69 MATIC por 1 O2PR token',
                'tokentext1': 'Airdrop: 0.1%',
                'tokentext2': 'Desenvolvimento: 20%',
                'tokentext3': 'Pool de liquidez para cultivo de criptomoedas: 26%',
                'tokentext4': 'Semente, Venda Privada A & B: 25%',
                'tokentext5': 'Fundador da equipe: 20%',
                'tokentext6': 'Marketing & Consultores: 8,9%',

                //MEDIUM BLOG
                'medium-title':'Últimas publicações do Medium sobre O2-Protocol',
                'medium-text':'Mantenha-se atualizado com as últimas notícias sobre O2-Protocol.',
                
                'blog1':'<a href="#" data-toggle="modal" data-target="#blog-modal-content"><span>24 de fevereiro de 2023</span>DEFI REGENERATIVO</a>',
                'blog2':'<a href="#" data-toggle="modal" data-target="#blog-modal-content2"><span>24 de fevereiro de 2023</span>NFT DE COMPENSAÇÃO DE CARBONO</a>',
                'blog3':'<a href="#" data-toggle="modal" data-target="#blog-modal-content3"><span>24 de fevereiro de 2023</span>AGRICULTURA DE RENDIMENTO ALAVANADO</a>',
                
                
                'medium-link':'LEIA MAIS POSTAGENS DO BLOG',

                //MODAL BLOG
                'modal1-text':'DEFI REGENERATIVO',
                'modal11-text':'Um novo conceito em DeFi<br><br>Apresentamos ao mundo um novo modelo de negócios para Finanças Descentralizadas que abre as portas aos modelos de negócios tradicionais para embarcar no mundo do ambiente criptográfico.<br><br>O2- Protocol tem como foco especial e exclusivo o modelo de negócio de mercado para compensação de carbono.<br><br>Para isso, vou explicar de forma simples em que consiste esse modelo de negócio tradicional e como o levamos para um ambiente criptográfico.< br> <br>No mercado de compensação de carbono, fábricas e empresas devem reabastecer o meio ambiente com a mesma quantidade de oxigênio que emitem para o meio ambiente com gases de efeito estufa (CO2) por suas fábricas ou negócios. Como um exemplo básico: uma fábrica de aeronaves na Alemanha libera dióxido de carbono (CO2) ao derreter metais para fabricar seus aviões. Para que essa fábrica continue operando por força de leis governamentais, ela precisa provar que todo o CO2 lançado no meio ambiente é compensado por O2 (oxigênio) em algum lugar do mundo. Para isso eles usam certificados de compensação de carbono, esses certificados confirmam que em algum lugar do mundo, em um prédio, uma quantidade X de oxigênio está sendo produzida, para uma quantidade X de árvores, etc etc etc e muitos outros dados. Em seguida, a fábrica de aeronaves busca nesses mercados os detentores ou vendedores desses certificados e, assim, apresenta-os às instituições governamentais reguladoras responsáveis ​​pelo controle de gases de efeito estufa, podendo assim continuar operando seus negócios.<br><br>O O O a próxima pergunta é: de quem e de onde vêm esses certificados de crédito de carbono?… continua no próximo blog',
                'modal1-date':'<a href="#">24 de fevereiro de 2023</a><a href="#">O2-Protocol</a>',
                'modal2-date':'<a href="#">24 de fevereiro de 2023</a><a href="#">O2-Protocol</a>',
                'modal3-date':'<a href="#">24 de fevereiro de 2023</a><a href="#">O2-Protocol</a>',

                'modal2-text':'CERTIFICADOS NFT DE COMPENSAÇÃO DE CARBONO',
                'modal22-text':'Onde obter certificados de compensação de carbono e como, finalmente, como monetizá-los no blockchain.<br>Existem dois tipos de mercado para compensações de gases de efeito estufa:<br><br>Público: administrado pelos governos de cada país< br> Privado: compensação de carbono voluntária.<br><br>Vamos nos concentrar na compensação de carbono voluntária (privada):<br>Existem várias organizações não governamentais conhecidas como ONGs que são responsáveis ​​por verificar e certificar projetos de compensação de carbono.< br >As duas mais conceituadas e conhecidas no mercado de compensação voluntária de carbono são Verra.org e Goldstandard.org<br>Quando o proprietário de uma propriedade rural decide reflorestar sua terra, ele precisa dessas ONGs para certificá-la. <br> Essas certificações são realizadas via satélite e, portanto, o custo de certificar qualquer projeto de compensação de carbono é muito alto, variando de US$ 5.000 a US$ 15.000, dependendo de vários fatores.<br><br>Uma vez que o proprietário paga esses valores para essas ONGs, recebe seu certificado e depois tem que colocar à venda no mercado voluntário de carbono.<br><br>Mas onde entra o O2-Protocol nisso tudo? Bem, a O2-Protocol financiará 100% dos custos de certificação para todos os proprietários que precisarem. Uma vez certificado o projeto, a O2-Protocol se encarrega de tokenizar esses certificados e levá-los para a blockchain, onde podem ser instantaneamente monetizados por outras criptomoedas e/ou ativos criptográficos, deixando o proprietário com 50% do valor do certificado . e os outros 50% do valor para O2-Protocol como conceito por ter financiado o projeto e gerenciado sua tokenização e monetização.<br><br>Mas não para por aí, o detentor desses certificados NFT terá acesso junto com outros usuários que não possuem NFTs para outros benefícios exclusivos, como fazer agricultura alavancada e gerar renda passiva no blockchain através do O2-Protocol.<br><br>No próximo blog, explicarei como…',

                'modal3-text':'AGRICULTURA DE CRIPTO ALAVANCADA',
                'modal33-text':'O2-Protocol – Gerará renda passiva com cripto cultivo alavancado.<br>Os usuários terão acesso a empréstimos garantidos e a opção de emprestar seu capital com garantias garantidas para receber renda passiva.<br><br>O2-Protocol usará um garfo de cultivo de criptografia alavancado baseado em Impermax, mas ao contrário de todos os DeFi no mercado, o O2-Protocol gera constantemente um fluxo de dinheiro para pools de liquidez por meio de modelos de negócios, como compensação de carbono de certificação de financiamento, o que cria pressão de compra no token nativo do O2-Protocol chamado O2PR token.<br>A função do token O2PR não servirá apenas para pagar taxas de empréstimos, mas também terá poder de voto para a eleição dos projetos a serem financiados, escolha para a criação de fundos de liquidez em agricultura criptográfica alavancada, também lhe dá acesso aos lucros da própria plataforma proporcionalmente com base no valor mantido e depositado nos contratos inteligentes, e muitas outras opções.<br><br>O2-Protocol se beneficiará de cada projeto que certificar, pois a maior parte da receita será destinada à adição de mais fundos aos pools de liquidez alavancados para o cultivo de criptografia, que se traduz em maior valor apreciativo no mercado de token O2PR.',

                //LEAVE US MESSAGE
                'leave':'Deixe-nos uma mensagem',
                'firstname':'Primeiro nome',
                'lastname':'Sobrenome',
                'phone':'Telefone',
                'email':'e-mail',
                'message':'Mensagem',
                'submit':'ENVIE SUA MENSAGEM',

                //CONTACT US
                'contactus':'Contate-nos',

                //NEWSLETTER
                'news-title':'Boletim de Notícias',
                'news-text':'Inscreva-se para receber atualizações da campanha da ICO',
                'news-name':'Nome',
                'news-email':'e-mail',
                'news-submit':'ENVIAR',

                //bottom

                'company-title':'O2-PROTOCOL',
                'about-bottom':'Sobre',
                'team-bottom':'Equipe',
                'blog-bottom':'Blog',
                'contact-bottom':'Contato',


                'ico-funding':'FINANCIAMENTO DA OIC',
                'bottom-feature': 'Caracteristicas',
                'bottom-product': 'Produtos',
                'bottom-roadmap': 'Roteiro',
                'bottom-token':'Token',
            },
            'kr': {
                //top banners
                'top-features': '특징',
                'top-products': '제품',
                'top-roadmap': '로드맵',
                'top-about': '에 대한',
                'top-team': '팀',
                'top-token': '토큰',
                'top-blog':'블로그',
                'top-contact': '연락하다',
                'connect': '연결하다',
                'connectwallet':'지갑 연결',
                'disconnect':'연결 끊기',
                
                //video
                'intro-video-url': 'https://www.youtube.com/watch?v=DuEkvI88PbE&t=1s',
                
                //middle description
                'banner-title': '탄소 상쇄 금융 및 레버리지 크립토 파밍 디파이<br>탈중앙화 금융',
                'banner-description': '자금 흐름을 생성하는 탄소 상쇄 토큰으로 레버리지 암호화 농업 탄소 상쇄 프로젝트 인증 및 토큰화 자금 조달을 통한 수입.',
                'whitepaper': '백지',
                'intro-video': '소개 영상',
                'financial-text1': '시드 라운드 시작',
                //'프라이빗 라운드 A 시작',
                //'프라이빗 라운드 B는 에서 시작합니다.',

                'connectwallet':'지갑 연결',
                'purchase-o2p':'O2PR 토큰 구매',

                //get whitelisted
                'getwhitelisted':'화이트리스트에 액세스하고 Airdrop 100 O2PR 토큰(약 $100 상당)을 받으세요.',
                'toparticipate':'파이낸셜 라운드 및 추첨 에어드롭에 참여하려면 다음 작업을 완료하세요.',
                'toparticipate2':'5명의 연락처 <a href="https://twitter.com/o2_protocolDAO/status/1631017830215819264?s=20" target="_blank" rel="noopener noreferrer"> Twitter</a>와 리트윗, 좋아요 및 공유',
                'toparticipate3':'5명의 <a href="https://www.instagram.com/reel/CpQOeVdANUj/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer">Instagram</a> 연락처에 좋아요를 누르고 공유하세요.',
                'toparticipate4':'<a href="https://discord.gg/DxpFhzNr">Discord</a>에서 저희 채널에 가입하세요',
                'toparticipate5':'<a href="https://t.me/+yB50AQTUJoozM2U5">Telegram</a>에서 저희 채널에 가입하세요',
                'toparticipate6':'각 금융 라운드에 참여하려면 사용자가 위의 작업을 완료하여 화이트리스트에 추가되어야 합니다.<br>Raffle은 4월 1일, 4월 20일, 5월 10일에 YouTube에서 생중계됩니다.<br>추가 공지 및 알림을 받으려면 뉴스레터에 가입하세요.',
                    
                //how to claim
                'howtoclaim':'구매한 토큰을 청구하는 방법:',
                'howtoclaim2':'모든 재정 라운드가 종료되면 매일 0.27%의 베스팅 비율로 구매한 토큰을 청구할 수 있습니다.<br>베스팅 토큰을 받는 동안 잠긴 나머지 베스팅 토큰에 대한 스테이킹 금고의 수익도 받게 됩니다.',

                //how it works
                'howitworks':'작동 방식:',
                'stephow': 'O2-Protocol은 Verra, Goldstandard 등과 같은 NGO를 통해 프로젝트 소유자와의 법적 계약과 연결된 CO2 프로젝트 인증에 자금을 지원합니다.',
                'stephow2': '인증은 Toucan NFT 프로토콜 또는 기타 유사한 프로토콜을 통해 토큰화됩니다.',
                'stephow3': 'NFT는 탄소 상쇄 토큰으로 변환되어 USDT로 교환됩니다.',
                'stephow4': 'O2-Protocol은 인증 및 토큰화 자금 조달을 위해 USDT의 50%를 유지하고 나머지 50%는 프로젝트 소유자에게 갑니다.',
                'stephow5': '획득한 수익은 유동성 풀, 신규 프로젝트 자금 조달, 금고, 급여 지급 및 마케팅에 분배됩니다.',
                

                //business model
                'business-model': '비즈니스 모델',
                'o2p-token': 'O2PR 토큰',

                'finance-carbon': '탄소 상쇄 인증 프로젝트의 재정. O2-Protocol은 인증의 액면가의 50%를 DEX에서 시가로 유지합니다.',
                'finance-banner': '재원',
                'monetization-banner': '수익화',
                'monetization-text': '탈중앙화 교환기(DEX)를 통해 다른 암호화폐와 즉시 교환할 수 있는 탄소 상쇄 인증서의 토큰화.',
                'smart-text': 'O2-Protocol 스마트 계약에 잠근 O2PR 토큰 양에 비례하는 비율을 받습니다. NFT 소유자는 독점적이고 특별한 금융 혜택을 받을 수 있습니다.',
                'smart-banner': '스마트 관리',

                'retire-text': 'NFT 탄소 상쇄 크레딧을 다시 현실 세계로 변환하고 폐기하십시오.',
                'retire-banner': '철수',

                'tokenization-text': 'O2-Protocol은 스마트 계약으로 잠긴 O2PR 토큰 보유자의 투표를 통해 선출된 선택된 프로젝트의 인증 프로세스 및 토큰화를 관리합니다.',
                'tokenization-banner':'토큰화',

                'farming-text': 'O2-Protocol 금고의 이익 수익은 유동성 풀로 이동하여 사용자가 레버리지 농업을 위해 프리미엄 할인으로 차용할 수 있게 됩니다.',
                'farming-banner':'레버리지 수익',

                'price-text': 'O2-Protocol은 탄소 상쇄 인증을 기반으로 실제 금융 자산에서 지속적으로 수입을 창출하고 시장에서 O2PR 토큰을 다시 구매하여 더 높은 O2PR 가격 가치로 변환되는 구매 압력을 생성합니다.',
                'price-banner':'가격 전략',

                'stake-text':'스마트 계약(지분)에 O2PR 토큰을 잠그고 플랫폼 전체 수입 수익의 일부를 받고 레버리지 농업을 위한 프로젝트 선택 및 유동성 농업 풀 생성과 같은 플랫폼 제안에 대한 투표권에 대한 액세스 권한을 받으십시오.',
                'stake-banner':'잉그레소스 파시보스',

                'product-title':'제품 세부 정보',
                'product-text': '농업 전략, 탄소 상쇄 프로젝트 유형 및 목표에 대해 자세히 알아보십시오.',
                'product-a':'잉그레소스 파시보스',
                'product-b':'토큰화',
                'product-c':'파이낸싱',

                'leverage-title':'레버리지 수익률 암호화 농업<br> 레버리지 유동성 풀에서 20%에서 200% 사이의 추정 연이율.',
                'leverage-text':'유동성 풀 토큰: 비트코인, 이더리움, 매틱, 라이트코인, 탄소 상쇄 토큰, 스테이블 코인 및 O2PR 토큰.',

                'tokenization-product-title':'파라과이, 브라질, 아르헨티나 및 우루과이(MERCOSUR)의 탄소 상쇄 프로젝트 토큰화<br>삼림 재조림 및 보호',
                'tokenization-product-text':'MERCOSUR의 NGO와 전략적 제휴를 맺은 O2-Protocol은 토지 소유자와 협력하여 탄소 상쇄 인증 및 토큰화 획득을 돕고<br>프로젝트 소유자가 재조림 및/또는 산림 보호를 통해 수익을 창출하도록 돕습니다.< 우리 플랫폼을 통해.',

                'financing-title':'재조림, 태양광 패널 및 풍력 발전 프로젝트',
                'financing-text':'태양광 패널 및 풍력 발전 회사 스타트업 프로젝트와의 파트너십.<br>O2-Protocol이 자금을 조달하고 주주가 될 수도 있습니다.<br>Hydroelectrics도 향후 국가 정부와의 특별 파트너십 계약을 통해 목표로 삼을 것입니다.',

                //ROADMAP
                'roadmap-title':'로드맵',
                'roadmap-description':'이것은 우리의 2023년 로드맵이며 올해까지 더 많은 작업을 통합할 가능성이 있습니다.',
                'roadmap1':'<span>2023년 4월</span>파이낸셜 라운드: SEED',
                'roadmap1-description': '● 시드 파이낸셜 라운드<br>● 프라이빗 세일 A<br>● 프라이빗 세일 B<br>● 법적 지위 확립',

                'roadmap2':'<span>2023년 5월</span>프로젝트 런칭',
                'roadmap2-description': '● 레버리지 DAPP<br>● 통합 크라우드펀딩 플랫폼 DAPP 비즈니스<br>● 런치패드 탄소 상쇄 프로젝트',

                'roadmap3':'<span>2023년 7월</span>NFT 시장 및 토큰화 브리지',
                'roadmap3-description': '● Carbon Offset NFT 마켓플레이스<br>● Carbon Offset Tokenization Bridge<br>● 모바일 앱',

                'roadmap4':'<span>2023년 11월</span>법적 준수 및 KYC',
                'roadmap4-description': '● 콩, 쌀, 밀 및 옥수수 상품 토큰화<br>● KYC 법률 준수<br>● 자금 세탁 방지 법률 준수<br>● 직불 카드',

                //ABOUT US
                'about1': '회사 소개',
                'aboutus-description': 'O2-Protocol은 2020년 초 개념적 아이디어로 시작되었습니다.<br><br>2021년까지 O2-Protocol은 National University of Asunción, Start-up Lab 부서와 사전 인큐베이션 프로세스를 시작하여 사전 인큐베이션 프로세스를 마무리했습니다. 마케팅, 금융, 탄소 상쇄 시장, 농업 관련 비즈니스 등 다양한 분야에서 오랜 연구 끝에 2022년 초에.<br><br>2022년 중반에 최종 인큐베이션 프로세스를 시작했습니다.<br><br> DeFi 프로젝트가 탄소 상쇄 거래와 같은 실제 비즈니스 모델과 결합되어 암호화 환경에서 수입 흐름을 생성하는 것은 전체 암호화폐 세계에서 처음입니다.',

                //OPERATING TEAM
                'team-members':'팀 멤버',
                'operating':'운영팀',
                'cesar': 'Cesar는 법률 분야에서 12년 이상의 경력과 프로그래밍 및 증권 거래 분야에서 20년 이상의 경력을 가진 변호사이자 블록체인 개발자입니다.',
                'cesar-title':'Cesar Saguier<span>CEO/CTO, Blockchain dev<br>변호사, 설립자</span>',
                'maria':'Maria Liz는 강력한 재무 관리 및 관리 경험 포트폴리오를 제공합니다.<br>그녀는 법률 및 공증인 분야뿐만 아니라 관리 및 포트폴리오 관리 분야에서도 방대한 경험을 보유하고 있습니다.',
                'maria-title':'Maria Liz Galeano<span>최고 재무 책임자 및 법률 고문</span>',
                'ale':'Ale은 국제적으로 다양한 수준의 광대한 인맥 네트워크를 보유한 마케팅 전략가 컨설턴트이자 고문입니다.<br>그는 21년 이상 엔지니어링 및 관리 분야에서 이학 석사 학위를 받았습니다.',
                'ale-title':'Alejandro Nuñez<span>최고 전략 책임자<br>마케팅 및 혁신</span>',
                'erika':'컨설턴트 및 고문으로서 20년 이상의 전문적인 경험.<br>지속 가능성의 패러다임, 환경 영향, 지역 수준의 사회 문화적 및 경제적 전문 기술.',
                'erika-title':'Erika Beckelmann<span>지속 가능한 환경 관리 설계자</span>',

                //100 MILLION
                '100million':'1억 개의 O2PR 토큰',
                '100million-text':'2021년 약 20억 달러 규모였던 자발적 탄소 상쇄 시장은 2030년까지 100~400억 달러 규모로 성장',
                '100million-text2':'O2PR 토큰은 1억 개를 넘지 않을 것이며 현재 시장 규모는 20억 달러<br>이며 이는 1:20 비율이며 현재 탄소 상쇄 시가 총액으로 토큰당 20달러에 해당합니다.<br>O2PR는 지속적으로 추가할 것입니다. 새로운 프로젝트 인증 및 토큰화 주입을 통한 시가총액.',
                 
                //TOKEN DISTRIBUTION
                'token-distribution':'토큰 분배',
                'token-distribution-text':'O2-Protocol은 판매 압력을 피하기 위해 평균 8.33%의 월별 할당으로 각 자금 조달 라운드에 12개월 할당 모델을 사용합니다.<br><br> ● 초기 라운드: O2PR 토큰은 1개의 O2PR 토큰에 대해 0.65 MATIC으로 가격이 책정됩니다. <br> ● 프라이빗 세일 A: O2PR 토큰 가격은 O2PR 토큰 1개당 0.67 MATIC으로 제공됩니다.<br> ● 프라이빗 세일 B: O2PR 토큰 가격은 O2PR 토큰 1개당 0.69 MATIC으로 제공됩니다.',
                'tokentext1': '에어드랍: 0.1%',
                'tokentext2': '개발: 20%',
                'tokentext3': '암호화폐 농사를 위한 유동성 풀: 26%',
                'tokentext4': '시드, 프라이빗 세일 A & B: 25%',
                'tokentext5': '팀 설립자: 20%',
                'tokentext6': '마케팅 및 고문: 8.9%',

                //MEDIUM BLOG
                'medium-title':'O2-Protocol에 대한 최신 매체 블로그 게시물',
                'medium-text':'O2-Protocol의 최신 뉴스를 확인하세요.',
                
                'blog1':'<a href="#" data-toggle="modal" data-target="#blog-modal-content"><span>2023년 2월 24일</span>재생 데피</a>',
                'blog2':'<a href="#" data-toggle="modal" data-target="#blog-modal-content2"><span>2023년 2월 24일</span>NFT 탄소 오프셋 인증서</a>',
                'blog3':'<a href="#" data-toggle="modal" data-target="#blog-modal-content3"><span>2023년 2월 24일</span>레버리지 수확 농업</a>',

                'medium-link':'더 많은 블로그 게시물 읽기',

                //MODAL BLOG
                'modal1-text':'재생 데피',
                'modal11-text':'DeFi의 새로운 개념<br><br>우리는 암호화 환경의 세계에 착수하기 위해 전통적인 비즈니스 모델의 문을 여는 탈중앙화 금융을 위한 새로운 비즈니스 모델을 전 세계에 제시합니다.<br><br>O2- 프로토콜 특히 탄소 상쇄를 위한 시장 비즈니스 모델에만 집중합니다.<br><br>이를 위해 이 전통적인 비즈니스 모델이 무엇으로 구성되어 있으며 이를 암호화 환경으로 가져오는 방법을 간단하게 설명하겠습니다.< br> <br>탄소 상쇄 시장에서 공장과 기업은 공장이나 기업에서 온실 가스(CO2)로 환경에 배출하는 것과 동일한 양의 산소로 환경을 보충해야 합니다. 기본 예: 독일의 항공기 공장은 비행기를 만들기 위해 금속을 녹일 때 이산화탄소(CO2)를 방출합니다. 정부법에 따라 이 공장이 계속 운영되기 위해서는 환경으로 배출되는 모든 CO2가 세계 어딘가의 O2(산소)에 의해 상쇄된다는 것을 증명해야 합니다. 이를 위해 그들은 탄소 상쇄 인증서를 사용합니다. 이 인증서는 세계 어딘가, 건물에서 X량의 나무 등 및 기타 많은 데이터에 대해 X량의 산소가 생산되고 있음을 확인합니다. 그러면 항공기 공장은 이러한 인증서의 보유자 또는 판매자를 이러한 시장을 검색하여 온실 가스 관리를 담당하는 규제 정부 기관에 제시하여 비즈니스를 계속 운영할 수 있습니다.<br><br>The The The The 다음 질문은 이 탄소 배출권 인증서는 누구와 어디서 오는 것입니까?… 다음 블로그에서 계속됩니다.',
                'modal1-date':'<a href="#">2023년 2월 24일</a><a href="#">O2 프로토콜</a>',
                'modal2-date':'<a href="#">2023년 2월 24일</a><a href="#">O2 프로토콜</a>',                    
                'modal3-date':'<a href="#">2023년 2월 24일</a><a href="#">O2 프로토콜</a>',

                'modal2-text':'탄소 상쇄 NFT 인증서',
                'modal22-text':'탄소 상쇄 인증서를 얻을 수 있는 위치와 방법, 마지막으로 블록체인에서 수익을 창출하는 방법.<br>온실가스 상쇄 시장에는 두 가지 유형이 있습니다.<br><br>공공: 각 국가의 정부가 운영< br> 민간: 자발적인 탄소 상쇄.<br><br>자발적인(민간) 탄소 상쇄에 초점을 맞추자:<br>탄소 상쇄 프로젝트를 확인하고 인증하는 NGO로 알려진 여러 비정부 기구가 있습니다.< br >자발적 탄소 상쇄 시장에서 가장 유명하고 잘 알려진 두 곳은 Verra.org와 Goldstandard.org입니다<br>농촌 소유주가 자신의 토지를 재조림하기로 결정하면 이를 인증하기 위해 이러한 NGO가 필요합니다. <br> 이러한 인증은 위성을 통해 수행되므로 탄소 상쇄 프로젝트 인증 비용은 다양한 요인에 따라 $5,000에서 $15,000까지 매우 높습니다.<br><br>Once 소유자가 이러한 NGO에 이 금액을 지불하고 인증서를 받은 다음 자발적인 탄소 시장에 판매해야 합니다. 음, O2-Protocol은 인증이 필요한 모든 소유자를 위해 인증 비용의 100%를 지원합니다. 프로젝트가 인증되면 O2-Protocol은 이러한 인증서를 토큰화하고 다른 암호화폐 및/또는 암호화 자산으로 즉시 수익을 창출할 수 있는 블록체인으로 가져가 소유자에게 인증서 가치의 50%를 맡깁니다. . 나머지 50%는 프로젝트에 자금을 조달하고 토큰화 및 수익화를 관리하기 위한 개념으로 O2-Protocol의 가치입니다.<br><br>하지만 여기서 끝나지 않고 이러한 NFT 인증서 소유자는 함께 액세스할 수 있습니다. NFT가 없는 다른 사용자와 함께 O2-Protocol을 통해 레버리지 파밍을 하고 블록체인에서 소극적 소득을 창출하는 것과 같은 다른 독점 혜택을 받을 수 있습니다.<br><br>다음 블로그에서 방법을 설명하겠습니다.',

                'modal3-text':'레버리지 암호화폐 파밍',
                'modal33-text':'O2-Protocol – 레버리지 암호화폐 농법으로 소극적 소득을 창출합니다.<br>사용자는 담보 대출에 액세스할 수 있으며 담보 담보로 자본을 빌려 수동적 소득을 얻을 수 있습니다.<br><br>O2-Protocol은 Impermax를 기반으로 암호화폐 파밍 포크를 활용하지만 시장의 모든 DeFi와 달리 O2-Protocol은 O2PR라는 O2-Protocol의 기본 토큰에 대한 구매 압력을 생성하는 인증 자금 조달 탄소 청산과 같은 비즈니스 모델을 통해 유동성 풀에 지속적으로 자금 흐름을 생성합니다. 토큰.<br>O2PR 토큰의 기능은 대출 수수료를 지불하는 역할을 할 뿐만 아니라 자금을 조달할 프로젝트 선택에 대한 의결권, 레버리지 암호화 농업에서 유동성 자금 생성을 위한 선택, 또한 플랫폼 자체의 이익에 대한 액세스를 제공합니다. 스마트 계약에 보유 및 예치된 금액 및 기타 여러 옵션에 따라 비례합니다.<br><br>O2-Protocol은 대부분의 수익이 레버리지 유동성 풀에 더 많은 자금을 추가하는 데 사용되므로 인증하는 각 프로젝트에서 이익을 얻습니다. O2PR 토큰 시장에서 더 높은 감사 가치로 변환되는 암호화 농업을 위해.',

                //LEAVE US MESSAGE
                'leave':'메시지를 남겨주세요',
                'firstname':'이름',
                'lastname':'성',
                'phone':'핸드폰',
                'email':'이메일',
                'message':'메시지',
                'submit':'메시지 제출',

                //CONTACT US
                'contactus':'문의하기',

                //NEWSLETTER
                'news-title':'뉴스 레터',
                'news-text':'ICO 캠페인 업데이트에 등록하십시오.',
                'news-name':'전체 이름',
                'news-email':'이메일',
                'news-submit':'제출하다',

                //bottom
                'company-title':'O2 프로토콜',
                'about-bottom':'에 대한',
                'team-bottom':'팀',
                'blog-bottom':'블로그',
                'contact-bottom':'연락하다',

                'ico-funding':'ICO 펀딩',
                'bottom-feature': '형질',
                'bottom-product': '제품',
                'bottom-roadmap': '로드맵',
                'bottom-token':'토큰',
            },
            'ch': {
                //top banners
                'top-features': '特徵',
                'top-products': '產品',
                'top-roadmap': '路線圖',
                'top-about': '關於',
                'top-team': '團隊',
                'top-token': '代幣',
                'top-blog':'博客',
                'top-contact': '接觸',
                'connect': '连接',
                'connectwallet':'連接錢包',
                'disconnect':'斷開',
                
                //video 
                'intro-video-url': 'https://www.youtube.com/watch?v=_4s_6KweAHE&t=1s',

                //middle description
                'banner-title': '碳抵消金融和槓桿加密農業 De-Fi<br>去中心化金融',
                'banner-description': '利用碳抵消代幣產生資金流的槓桿加密農業通過碳抵消項目認證和代幣化融資獲得收入。',
                'whitepaper': '白皮書',
                'intro-video': '簡介視頻',
                'financial-text1': '種子輪開始於',
                //'私人A輪開始於',
                //'私人 B 輪開始於',

                'connectwallet':'連接錢包',
                'purchase-o2p':'購買 O2PR 代幣',

                 //get whitelisted
                'getwhitelisted':'獲得白名單訪問權並獲得空投 100 個 O2PR 代幣（價值約 100 美元）',
                'toparticipate':'要參與財務輪次和抽獎空投，請完成以下任務：',
                'toparticipate2':'轉發、點贊並與 5 個聯繫人分享 <a href="https://twitter.com/o2_protocolDAO/status/1631017830215819264?s=20" target="_blank" rel="noopener noreferrer"> 推特</a>',
                'toparticipate3':'點贊並分享給 5 個 <a href="https://www.instagram.com/reel/CpQOeVdANUj/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer">Instagram</a> 聯繫人',
                'toparticipate4':'在 <a href="https://discord.gg/DxpFhzNr">Discord</a> 上加入我們的頻道',
                'toparticipate5':'在 <a href="https://t.me/+yB50AQTUJoozM2U5">Telegram</a> 上加入我們的頻道',
                'toparticipate6':'為了能夠參與每個財務回合，用戶必須通過完成上述任務列入白名單<br>Raffle 將於 4 月 1 日、4 月 20 日、5 月 10 日在 YouTube 上直播<br>註冊我們的時事通訊以獲取進一步的通知和提醒',
                    
                //how to claim
                'howtoclaim':'如何領取您購買的代幣：',
                'howtoclaim2':'在所有財務回合結束後，您將能夠以每天 0.27% 的歸屬率領取您購買的代幣<br>當您收到您的歸屬代幣時，您還將從鎖倉中獲得鎖定的剩餘歸屬代幣的收益收入',
                
                //how it works
                'howitworks':'怎麼運行的：',
                'stephow': 'O2-Protocol 將通過 Verra、Goldstandard 或其他非政府組織資助 CO2 項目的認證，並與項目所有者簽訂法律協議',
                'stephow2':'然後通過 Toucan NFT 協議或其他類似協議對證書進行標記化',
                'stephow3': 'NFTs 然後被轉換為碳抵消代幣並兌換成 USDT',
                'stephow4': 'O2-Protocol 保留 50% 的 USDT 用於資助認證和代幣化，另外 50% 歸項目所有者',
                'stephow5': '獲得的利潤將分配到流動資金池、新項目融資、金庫、工資支付和營銷',
                
                //business model
                'business-model': '商業模式',
                'o2p-token': 'O2PR令牌', 

                'finance-carbon': '碳抵消認證項目的融資。 O2-Protocol 在 DEX 中按市場價格保留 50% 的通證面值',
                'finance-banner': '金融',
                'monetization-banner': '貨幣化',
                'monetization-text': '碳抵消證書的標記化，允許通過去中心化交易所 (DEX) 即時交換其他加密貨幣。',
                'smart-text': '收到您鎖定在 O2-Protocol 智能合約上的 O2PR 代幣數量的比例百分比。 NFT 所有者將可以獲得獨家和特殊的經濟利益。',
                'smart-banner': '智能管理',

                'retire-text': '將您的 NFT 碳抵消額度轉換並退回現實世界。',
                'retire-banner': '退出',
                'tokenization-text': 'O2-Protocol 將管理通過智能合約鎖定的 O2PR 代幣持有者投票選出的選定項目的認證過程和代幣化。',
                'tokenization-banner':'代幣化',

                'farming-text': 'O2-Protocol 資金庫的利潤收入將進入流動性池，用戶可以以溢價借款進行槓桿耕作。',
                'farming-banner':'槓桿收益',

                'price-text': 'O2-Protocol 將根據碳抵消認證不斷從現實世界的金融資產中創造收入，並從市場上回購 O2PR 代幣，從而產生購買壓力，從而轉化為更高的 O2PR 價格價值。',
                'price-banner':'價格策略',


                'stake-text':'將您的 O2PR 代幣鎖定在我們的智能合約（股份）上，並獲得平台總收入的一部分，並獲得對平台提案的投票權，例如項目選擇和為槓桿農業創建流動性農業池。',
                'stake-banner':'被動語態',

                'product-title':'產品詳情',
                'product-text': '進一步了解我們的農業戰略、碳抵消項目類型和目標。',
                'product-a':'被動語態',
                'product-b':'代幣化',
                'product-c':'融資',

                'leverage-title':'槓桿收益加密農業<br> 槓桿流動資金池的年利率估計在 20% 到 200% 之間。',
                'leverage-text':'流動資金池代幣：比特幣、以太坊、Matic、萊特幣、碳抵消代幣、穩定幣和 O2PR 代幣。',

                'tokenization-product-title':'巴拉圭、巴西、阿根廷和烏拉圭 (MERCOSUR) 的碳抵消項目代幣化<br>再造林和森林保護',
                'tokenization-product-text':'通過與 MERCOSUR 的非政府組織建立戰略聯盟，O2-Protocol 將<br>與土地所有者合作，幫助他們獲得碳抵消認證和代幣化<br>幫助這些項目所有者通過重新造林和/或森林保護產生收入< br>通過我們的平台。',

                'financing-title':'重新造林、太陽能電池板和風力發電項目',
                'financing-text':'與太陽能電池板和風力發電公司的初創項目合作。<br>O2-Protocol 將能夠為其提供資金並成為其股東。<br>水電也將在未來通過與各國政府的特殊合作協議達成目標。',

                //ROADMAP
                'roadmap-title':'路線圖',
                'roadmap-description':'這是我們的 2023 年路線圖，我們可能會在今年匯總更多任務。',
                'roadmap1':'<span>2023 年 4 月</span>融資輪：SEED',
                'roadmap1-description': '● 種子輪融資<br>● 私募A<br>● 私募B<br>● 法律地位確立',

                'roadmap2':'<span>2023 年 5 月</span>項目啟動',
                'roadmap2-description': '● 槓桿式DAPP<br>● 集成眾籌平台DAPP業務<br>● Launchpad碳抵消項目',

                'roadmap3':'<span>2023 年 7 月</span>NFT 市場和代幣化橋樑',
                'roadmap3-description': '● 自 NFT 代幣化橋樑<br>● 碳抵消 NFT 市場<br>● 眾籌平台 dAPP 集成<br>● 移動應用程序',

                'roadmap4':'<span>2023 年 11 月</span>法律合規與 KYC',
                'roadmap4-description': '● 大豆、大米、小麥和玉米商品代幣化<br>● KYC 合規性<br>● 反洗錢合規性<br>● 借記卡',

                //ABOUT US
                'about1': '關於我們',
                'aboutus-description': 'O2-Protocol 始於 2020 年初的概念性想法。<br><br>到 2021 年，O2-Protocol 開始與亞松森國立大學初創實驗室部門進行預孵化過程，最終完成預孵化過程在營銷、金融、碳抵消市場、農業綜合企業等各個領域進行了長期研究後，於 2022 年初啟動。<br><br>2022 年年中，我們開始了最後的孵化過程。<br><br>這是整個加密世界中第一次將 DeFi 項目與碳抵消交易等真實商業模式相結合，從而在加密環境中產生收入流。',

                //OPERATING TEAM
                'team-members':'團隊成員',
                'operating':'運營團隊',
                'cesar': 'Cesar 是一名律師和區塊鏈開發人員，擁有超過 12 年的法律經驗和超過<br>20 年的編程和證券交易交易經驗。',
                'cesar-title':'Cesar Saguier<span>首席執行官/首席技術官，區塊鏈開發人員<br>律師，創始人</span>',
                'maria':'Maria Liz 擁有豐富的財務管理和行政經驗。<br>她在法律和公證領域以及行政和投資組合管理方面擁有豐富的經驗。',
                'maria-title':'Maria Liz Galeano<span>首席財務官兼法律顧問</span>',
                'ale':'Ale 是一名營銷戰略顧問和諮詢師，在國際上擁有廣泛的各級人脈網絡。<br>他擁有超過 21 年的工程和管理理學碩士學位。',
                'ale-title':'Alejandro Nuñez<span>首席戰略官<br>營銷與創新</span>',
                'erika':'擁有超過 20 年的顧問和顧問專業經驗。<br>在可持續發展範式、其環境影響、區域層面的社會文化和經濟方面具有專業技能。',
                'erika-title':'Erika Beckelmann<span>可持續環境管理建築師</span>',

                //100 MILLION
                '100million':'1億個O2PR代幣',
                '100million-text':'自願碳抵消市場在 2021 年價值約 20 億美元，到 2030 年將增長到 10-400 億美元',
                '100million-text2':'不會有超過 1 億個 O2PR 代幣，目前的市場規模為 20 億美元<br>，即 1:20 的比率，這相當於每個代幣 20 美元，具有當前的碳抵消市值。<br>O2PR 將不斷增加通過注入新項目認證和標記化來實現市值價值。',

                //TOKEN DISTRIBUTION
                'token-distribution':'代幣分配',
                'token-distribution-text':'O2-Protocol 對每輪融資採用 12 個月的分配模式，平均每月分配 8.33% 以避免拋售壓力。<br><br> ● 首輪：O2PR 代幣的價格為 0.65 MATIC，1 個 O2PR 代幣。 <br> ● 私募 A：O2PR 代幣價格為每 1 個 O2PR 代幣 0.67 MATIC..<br> ● 私募 B：O2PR 代幣價格為每 1 個 O2PR 代幣 0.69 MATIC。',
                'tokentext1': '空投：0.1%',
                'tokentext2': '發展：20%',
                'tokentext3': '加密農業的流動資金池：26%',
                'tokentext4': '種子、私募 A 和 B：25%',
                'tokentext5': '團隊創始人：20%',
                'tokentext6': '營銷和顧問：8.9%',

                //MEDIUM BLOG
                'medium-title':'關於 O2 協議的最新中型博客文章',
                'medium-text':'了解有關 O2-Protocol 的最新消息。',
                'medium-link':'閱讀更多博客文章',
                
                'blog1':'<a href="#" data-toggle="modal" data-target="#blog-modal-content"><span>2023 年 2 月 24 日</span>再生DEFI</a>',
                'blog2':'<a href="#" data-toggle="modal" data-target="#blog-modal-content2"><span>2023 年 2 月 24 日</span>NFT 碳抵消證書</a>',
                'blog3':'<a href="#" data-toggle="modal" data-target="#blog-modal-content3"><span>2023 年 2 月 24 日</span>槓桿收益農業</a>',
                
                //MODAL BLOG
                'modal1-text':'再生DEFI',
                'modal11-text':'DeFi 中的一個新概念<br><br>我們向世界展示了一種新的去中心化金融商業模式，它打開了傳統商業模式的大門，從而踏上了加密環境的世界。<br><br>O2- 協議尤其專注於碳抵消的市場商業模式。<br><br>為此，我將以簡單的方式解釋這種傳統商業模式的組成以及我們如何將其應用到加密環境中。< br> <br>在碳抵消市場中，工廠和公司必須向環境補充與其工廠或企業排放到環境中的溫室氣體 (CO2) 等量的氧氣。舉一個基本的例子：德國的一家飛機製造廠在熔化金屬製造飛機時會釋放二氧化碳 (CO2)。為了讓這家工廠根據政府法律繼續運營，它必須證明所有釋放到環境中的 CO2 都被世界某個地方的 O2（氧氣）所抵消。為此，他們使用碳抵消證書，這些證書確認在世界的某個地方，在建築物中，正在生產 X 量的氧氣，用於 X 量的樹木等等以及許多其他數據。然後，飛機製造商在這些市場中搜索這些證書的持有者或銷售者，並將其提交給負責控制溫室氣體的政府監管機構，從而能夠繼續經營他們的業務。<br><br>The The下一個問題是：這些碳信用證書來自誰和哪裡？......在下一篇博客中繼續',
                'modal1-date':'<a href="#">2023 年 2 月 24 日</a><a href="#">O2協議</a>', 
                'modal2-date':'<a href="#">2023 年 2 月 24 日</a><a href="#">O2協議</a>', 
                'modal3-date':'<a href="#">2023 年 2 月 24 日</a><a href="#">O2協議</a>', 

                'modal2-text':'碳抵消 NFT 證書',
                'modal22-text':'從哪裡獲得碳抵消證書以及如何，最後如何在區塊鏈上將其貨幣化。<br>溫室氣體抵消有兩種類型的市場：<br><br>公共：由各國政府運營< br>私人：自願碳抵消。<br><br>讓我們關注自願（私人）碳抵消：<br>有幾個稱為 NGO 的非政府組織負責驗證和認證碳抵消項目。< br >自願碳抵消市場中最著名和最知名的兩個是 Verra.org 和 Goldstandard.org<br>當農村財產的所有者決定重新造林他的土地時，他需要這些非政府組織來證明它。<br>這些認證是通過衛星進行的，因此認證任何碳補償項目的成本都非常高，根據各種因素從 5,000 美元到 15,000 美元不等。<br><br>一次所有者向這些非政府組織支付這些款項，收到他的證書，然後必須將其在自願碳市場上出售。<br><br>但是 O2-Protocol 從哪裡來參與這一切？那麼，O2-Protocol 將為所有需要它的所有者提供 100% 的認證費用。一旦項目通過認證，O2-Protocol 將負責將這些證書標記化並將它們帶到區塊鏈，在那裡它可以立即被其他加密貨幣和/或加密資產貨幣化，讓所有者獲得證書價值的 50% .以及 O2-Protocol 價值的另外 50% 作為為項目提供資金並管理其標記化和貨幣化的概念。<br><br>但這並沒有就此結束，這些 NFT 證書的持有者將可以一起訪問與其他沒有 NFT 的用戶一起享受其他獨家好處，例如通過 O2-Protocol 在區塊鏈上進行槓桿農業和產生被動收入。<br><br>在下一篇博客中，我將解釋如何......',

                'modal3-text':'槓桿式加密農業',
                'modal33-text':'O2-Protocol – 將通過槓桿加密貨幣耕作產生被動收入。<br>用戶將可以獲得抵押貸款，並可以選擇使用抵押品借入資本以獲得被動收入。<br><br>O2-Protocol 將使用基於 Impermax 的槓桿加密農業分叉，但與市場上所有的 DeFi 不同，O2-Protocol 通過清算認證資金碳等商業模式不斷地向流動性池產生資金流，這對 O2-Protocol 的原生代幣 O2PR 造成了購買壓力代幣。<br>O2PR代幣的功能不僅可以用於支付貸款費用，而且還將擁有選舉融資項目的投票權，選擇在槓桿加密農業中創建流動資金，它將還可以讓您獲得平臺本身的利潤根據智能合約中持有和存入的金額以及許多其他選項按比例分配。<br><br>O2-Protocol 將從其認證的每個項目中受益，因為大部分收入將用於向槓桿流動性池中添加更多資金用於加密農業，這在 O2PR 代幣市場上轉化為更高的欣賞價值。',
                
                //LEAVE US MESSAGE
                'leave':'給我們留言',
                'firstname':'名',
                'lastname':'姓',
                'phone':'電話',
                'email':'電子郵件',
                'message':'信息',
                'submit':'提交您的留言',

                //CONTACT US
                'contactus':'聯繫我們',

                //NEWSLETTER
                'news-title':'通訊',
                'news-text':'註冊 ICO 活動更新。',
                'news-name':'全名',
                'news-email':'電子郵件',
                'news-submit':'提交',



                //bottom
                'company-title':'O2協議',
                'about-bottom':'關於',
                'team-bottom':'團隊',
                'blog-bottom':'博客',
                'contact-bottom':'接觸',

                'ico-funding':'ICO 資金',
                'bottom-feature': '特徵',
                'bottom-product': '產品',
                'bottom-roadmap': '路線圖',
                'bottom-token':'代幣',
            },
            'jp': {
                //top banners
                'top-features': '特徴',
                'top-products': '製品',
                'top-roadmap': 'ロードマップ',
                'top-about': 'だいたい',
                'top-team': 'チーム',
                'top-token': 'トークン',
                'top-blog':'ブログ',
                'top-contact': 'コンタクト',
                'connect': '接続する',
                'connectwallet':'コネクトウォレット',
                'disconnect':'切断する',
                
                //video
                'intro-video-url': 'https://www.youtube.com/watch?v=trYNFSefEAU',
                
                //middle description
                'banner-title': 'カーボン オフセット ファイナンスとレバレッジド クリプト ファーミング De-Fi<br>分散型ファイナンス',
                'banner-description': 'マネー フローを生成するカーボン オフセット トークンを使用した仮想通貨ファーミングの活用 カーボンオフセットプロジェクトの認証とトークン化の資金調達による収入。',
                'whitepaper': '白書',
                'intro-video': '紹介ビデオ',
                'financial-text1': 'シードラウンド開始',
                //'プライベートラウンドA開始',
                //'プライベート ラウンド B 開始時間',
                    
                'connectwallet':'コネクトウォレット',
                'purchase-o2p':'O2PR トークンを購入する',

                //get whitelisted
                'getwhitelisted':'ホワイトリストへのアクセスを取得し、Airdrop で 100 O2PR トークン (約 $100 の価値) を受け取ります',
                'toparticipate':'ファイナンシャル ラウンドとラッフル エアドロップに参加するには、次のタスクを完了してください。',
                'toparticipate2':'リツイート、いいね、5 人の連絡先 <a href="https://twitter.com/o2_protocolDAO/status/1631017830215819264?s=20" target="_blank" rel="noopener noreferrer"> Twiter</a> と共有',
                'toparticipate3':'5 人の <a href="https://www.instagram.com/reel/CpQOeVdANUj/?utm_source=ig_web_copy_link" target="_blank" rel="noopener noreferrer">Instagram</a> の連絡先といいねして共有する',
                'toparticipate4':'<a href="https://discord.gg/DxpFhzNr" target="_blank" rel="noopener noreferrer">Discord</a> のチャンネルに参加してください',
                'toparticipate5':'<a href="https://t.me/+yB50AQTUJoozM2U5" target="_blank" rel="noopener noreferrer">Telegram</a> のチャンネルに参加してください',
                'toparticipate6':'各財務ラウンドに参加できるようにするには、上記のタスクを完了してユーザーをホワイトリストに登録する必要があります<br>ラッフルは 4 月 1 日、4 月 20 日、5 月 10 日に YouTube でライブ配信されます<br>ニュースレターにサインアップして、詳細な通知とアラートを入手してください',
                    

                //how to claim
                'howtoclaim':'購入したトークンを請求する方法',
                'howtoclaim2':'すべてのファイナンシャル ラウンドが終了すると、購入したトークンを毎日 0.27% のベスティング レートで請求できるようになります。<br>権利確定トークンを受け取ると同時に、ロックされた残りの権利確定トークンのステーキング ボールトから収益収入も受け取ります。',
                
                //how it works
                'howitworks':'使い方：',
                'stephow': 'O2-Protocol は、Verra、Goldstandard などの NGO を通じて CO2 プロジェクトの認証に資金を提供し、プロジェクト所有者との法的契約にリンクしています',
                'stephow2': '証明書は、オオハシNFTプロトコルまたは他の同様のものを介してトークン化されます',
                'stephow3': 'その後、NFT はカーボン オフセット トークンに変換され、USDT に交換されます',
                'stephow4': 'O2-Protocol は、認証とトークン化に資金を提供した USDT の 50% を保持し、残りの 50% はプロジェクト オーナーに渡されます',
                'stephow5': '得られた利益は、流動性プール、新しいプロジェクトの資金調達、財務ボックス、給与の支払い、およびマーケティングに分配されます',
                

                //business model
                'business-model': '事業の型',
                'o2p-token': 'O2PRトークン',

                'finance-carbon': 'カーボン オフセット認証プロジェクトの資金調達。 O2 プロトコルは、証明書の額面価格の 50% を DEX の市場価格で保持します。',
                'finance-banner': 'ファイナンス',
                'monetization-banner': '収益化',
                'monetization-text': '分散型交換機 (DEX) を介して他の暗号通貨との即時交換を可能にするカーボン オフセット証明書のトークン化。',
                'smart-text': 'O2-Protocol スマートコントラクトでロックした O2PR トークンの量に比例したパーセンテージを受け取ります。 NFT の所有者は、排他的で特別な経済的利益にアクセスできます。',
                'smart-banner': 'スマート管理',

                'retire-text': 'NFT カーボン オフセット クレジットを変換して、現実の世界に戻します。',
                'retire-banner': '出金',

                'tokenization-text': 'O2-Protocol は、スマートコントラクトでロックされた O2PR トークン保有者による投票を通じて選出された選択されたプロジェクトの認証プロセスとトークン化を管理します。',
                'tokenization-banner':'トークン化',

                'farming-text': 'O2-Protocol トレジャリーからの収益は流動性プールに送られ、ユーザーはこれを利用して、レバレッジ ファーミングのプレミアム割引価格で借りることができます。',
                'farming-banner':'レバレッジ収益',

                'price-text': 'O2-Protocol は、カーボン オフセット証明書に基づいて実世界の金融資産から常に収入を生み出し、市場から O2PR トークンを買い戻して購入圧力を生み出し、O2PR 価格の価値を高めます。',
                'price-banner':'価格戦略',


                'stake-text':'私たちのスマートコントラクト (ステーク) で O2PR トークンをロックし、プラットフォーム全体の収入収入の一部を受け取り、プロジェクトの選択やレバレッジド ファーミングのための流動性ファーミング プールの作成などのプラットフォームの提案に対する投票権へのアクセスを受け取ります。',
                'stake-banner':'イングレソス パッシブ',

                'product-title':'製品詳細',
                'product-text': '私たちの農業戦略、カーボン オフセット プロジェクトの種類と目的について詳しく知ることができます。',
                'product-a':'イングレソス パッシブ',
                'product-b':'トークン化',
                'product-c':'資金調達',

                'leverage-title':'レバレッジドイールド クリプトファーミング<br> レバレッジド流動性プールの推定 APR は 20% から 200% です。',
                'leverage-text':'流動性プール トークン: ビットコイン、イーサリアム、マティック、ライトコイン、カーボン オフセット トークン、ステーブルコイン、O2PR トークン。',

                'tokenization-product-title':'パラグアイ、ブラジル、アルゼンチン、ウルグアイでのカーボン オフセット プロジェクトのトークン化 (MERCOSUR)<br>森林再生と森林保護',
                'tokenization-product-text':'メルコスールの NGO との戦略的提携により、O2-Protocol は<br>土地所有者がカーボン オフセット認証とトークン化を取得するのを支援し、<br>これらのプロジェクト所有者が再植林および/または森林保護で収益を生み出すのを支援します<br>私たちのプラットフォームを通じて。',

                'financing-title':'植林、ソーラーパネル、風力発電プロジェクト',
                'financing-text':'ソーラー パネルおよび風力発電会社のスタートアップ プロジェクトとのパートナーシップ。<br>O2-Protocol は、それらに資金を提供し、株主にもなることができます。<br>水力発電も、将来的には各国政府との特別なパートナーシップ契約を通じて目指す予定です。',
                
                //ROADMAP
                'roadmap-title':'ロードマップ',
                'roadmap-description':'これは 2023 年のロードマップであり、今年中にさらに多くのタスクを集約する可能性があります。',
                'roadmap1':'<span>2023年4月</span>ファイナンシャル ラウンド: シード',
                'roadmap1-description': '● シード ファイナンシャル ラウンド<br>● プライベート セール A<br>● プライベート セール B<br>● 法的地位の確立',

                'roadmap2':'<span>2023年5月</span>プロジェクトの立ち上げ',
                'roadmap2-description': '● DAPP の活用<br>● インテグレーション クラウドファンディング プラットフォーム DAPP ビジネス<br>● Launchpad カーボン オフセット プロジェクト',

                'roadmap3':'<span>2023 年 7 月</span>NFT マーケットプレイス & トークナイゼーション ブリッジ',
                'roadmap3-description': '● セルフ NFT トークン化ブリッジ<br>● カーボン オフセット NFT マーケットプレイス<br>● クラウドファンディング プラットフォーム dAPP 統合<br>● モバイル APP',

                'roadmap4':'<span>2023 年 11 月</span>法令順守とKYC',
                'roadmap4-description': '● 大豆、米、小麦、とうもろこし商品のトークン化<br>● KYC 法への準拠<br>● アンチマネー ランドリー法への準拠<br>● デビットカード',

                //ABOUT US
                'about1': '私たちに関しては',
                'aboutus-description': 'O2-Protocol は 2020 年の初めに概念的なアイデアとして始まりました。<br><br>2021 年までに、O2-Protocol はアスンシオン国立大学のスタートアップ ラボ部門とのプレインキュベーション プロセスを開始し、プレインキュベーション プロセスの頂点に達しました。マーケティング、金融、カーボン オフセット市場、アグリビジネスなど、さまざまな分野での長期にわたる調査を経て、2022 年初頭に設立されました。<br><br>2022 年半ばに、最終的なインキュベーション プロセスを開始しました。<br><br>これは、DeFiプロジェクトがカーボンオフセット取引のような実際のビジネスモデルと組み合わされて、暗号環境で収入の流れを生み出す、暗号世界全体で初めてのことです。',

                //OPERATING TEAM
                'team-members':'チームメンバー',
                'operating':'運営チーム',
                'cesar': 'Cesar は、法律分野で 12 年以上、プログラミングと証券取引で 20 年以上の経験を持つ弁護士兼ブロックチェーン開発者です。',
                'cesar-title':'Cesar Saguier<span>CEO / CTO、ブロックチェーン デベロッパー<br>弁護士、創設者</span>',
                'maria':'Maria Liz は、財務管理と管理の経験の強力なポートフォリオをもたらします。<br>彼女は、法律と公証人の分野だけでなく、管理とポートフォリオ管理の分野でも豊富な経験を持っています。',
                'maria-title':'Maria Liz Galeano<span>最高財務責任者兼法律顧問</span>',
                'ale':'Ale はマーケティング ストラジストのコンサルタント兼アドバイザーであり、国際的にさまざまなレベルで膨大な人脈を持っています。<br>彼は 21 年以上のエンジニアリングと管理の理学修士号を取得しています。',
                'ale-title':'Alejandro Nuñez<span>最高戦略責任者<br>マーケティング & イノベーション</span>',
                'erika':'コンサルタントおよびアドバイザーとして 20 年以上の専門的経験。<br>持続可能性のパラダイム、その環境への影響、地域レベルでの社会文化的および経済的側面における専門的スキル。',
                'erika-title':'Erika Beckelmann<span>持続可能な環境管理の建築家</span>',

                //100 MILLION
                '100million':'1億のO2PRトークン',
                '100million-text':'2021 年には約 20 億ドルの価値があった任意のカーボン オフセット市場は、2030 年までに 100 ～ 400 億ドルに成長する見込みです。',
                '100million-text2':'O2PR トークンは 1 億を超えず、現在の市場規模は 20 億ドルです。<br>これは 1:20 の比率であり、現在のカーボン オフセットの時価総額でトークンあたり 20 ドルに相当します。<br>O2PR は常に追加されます。新しいプロジェクト認証とトークン化の注入による時価総額の価値。',
                
                //TOKEN DISTRIBUTION
                'token-distribution':'トークンの配布',
                'token-distribution-text':'O2-Protocol は、売り圧力を避けるために、各資金調達ラウンドに 12 か月の割り当てモデルを使用し、毎月の平均割り当ては 8.33% です。<br><br> ● 最初のラウンド: O2PR トークンの価格は、1 O2PR トークンに対して 0.65 MATIC です。 <br> ● プライベート セール A: O2PR トークンの価格は、1 O2PR トークンあたり 0.67 MATIC で提供されます。<br> ● プライベート セール B: O2PR トークンの価格は、1 O2PR トークンあたり 0.69 MATIC で提供されます。',
                'tokentext1': 'エアドロップ: 0.1%',
                'tokentext2': '開発: 20%',
                'tokentext3': 'クリプトファーミングの流動性プール: 26%',
                'tokentext4': 'シード、プライベートセール A & B: 25%',
                'tokentext5': 'チームの創設者: 20%',
                'tokentex6':'マーケティングとアドバイザー: 8.9%',

                //MEDIUM BLOG
                'medium-title':'O2-Protocol に関する最新の中規模ブログ投稿',
                'medium-text':'O2-Protocol に関する最新ニュースを入手してください。',
                'medium-link':'もっとブログ記事を読む',
                

                
                'blog1':'<a href="#" data-toggle="modal" data-target="#blog-modal-content"><span>2023 年 2 月 24 日</span>リジェネレイティブデフィ</a>',
                'blog2':'<a href="#" data-toggle="modal" data-target="#blog-modal-content2"><span>2023 年 2 月 24 日</span>NFTカーボンオフセット証明書</a>',
                'blog3':'<a href="#" data-toggle="modal" data-target="#blog-modal-content3"><span>2023 年 2 月 24 日</span>レバレッジドイールドファーミング</a>',


                //MODAL BLOG
                'modal1-text':'リジェネレイティブデフィ',
                'modal11-text':'DeFi の新しい概念<br><br>分散型金融の新しいビジネス モデルを世界に提示します。これは、従来のビジネス モデルに扉を開き、暗号化環境の世界に乗り出すためのものです。<br><br>O2- プロトコル特に、カーボン オフセットの市場ビジネス モデルのみに焦点を当てています。<br><br>これを行うために、この従来のビジネス モデルの構成要素と、それをどのように暗号化環境に導入するかを簡単に説明します。< br> <br>カーボン オフセット市場では、工場や企業は、工場や企業が温室効果ガス (CO2) を環境に放出するのと同じ量の酸素を環境に補給する必要があります。基本的な例として、ドイツの航空機工場は、飛行機を作るために金属を溶かすときに二酸化炭素 (CO2) を放出します。この工場が政府の法律に従って操業を続けるためには、環境に放出されたすべての CO2 が世界のどこかで O2 (酸素) によって相殺されることを証明する必要があります。このために、彼らはカーボン オフセット証明書を使用します。これらの証明書は、世界のどこか、建物内で、X 量の酸素が生成されていること、X 量の木など、その他多くのデータを確認します。次に、航空機工場はこれらの証明書の所有者または販売者を市場で探し、温室効果ガスの管理を担当する規制政府機関に証明書を提示し、事業を継続できるようにします。<br><br>The The次の質問は、これらの炭素クレジット証明書は誰から、どこから来たのですか?…次のブログに続きます',
                'modal1-date':'<a href="#">2023 年 2 月 24 日</a><a href="#">O2プロトコル</a>',
                'modal2-date':'<a href="#">2023 年 2 月 24 日</a><a href="#">O2プロトコル</a>',
                'modal3-date':'<a href="#">2023 年 2 月 24 日</a><a href="#">O2プロトコル</a>',

                'modal2-text':'カーボンオフセットNFT証明書',
                'modal22-text':'カーボン オフセット証明書をどこで入手し、どのようにしてブロックチェーン上で収益化するか。<br>温室効果ガス オフセットには 2 種類の市場があります。<br><br>公開: 各国政府が運営します< br>民間: 自主的なカーボン オフセット。<br><br>自主的な (民間の) カーボン オフセットに注目しましょう:<br>NGO として知られるいくつかの非政府組織が、炭素のオフセット プロジェクトの検証と認証を担当しています。< br >自主的なカーボン オフセット市場で最も有名でよく知られているのは、Verra.org と Goldstandard.org の 2 つです。これらの認証は衛星経由で行われるため、カーボン オフセット プロジェクトの認証費用は非常に高く、さまざまな要因に応じて 5,000 ドルから 15,000 ドルになります。<br><br>1 回所有者はこれらの金額をこれらの NGO に支払い、証明書を受け取り、任意の炭素市場で売りに出さなければなりません。 O2-Protocol は、それを必要とするすべての所有者の認証費用を 100% 負担します。プロジェクトが認証されると、O2-Protocol はこれらの証明書をトークン化してブロックチェーンに持ち込むことを担当します。ブロックチェーンでは、他の暗号通貨や暗号資産によって即座に収益化でき、証明書の価値の 50% が所有者に残ります。 .そして、プロジェクトに資金を提供し、そのトークン化と収益化を管理するためのコンセプトとしての O2-Protocol の価値の残りの 50%。 NFT を持っていない他のユーザーと一緒に、O2-Protocol を介してレバレッジド ファーミングを行ったり、ブロックチェーンで受動的収入を生成したりするなど、他の排他的な利点を得ることができます。<br><br>次のブログでは、その方法について説明します…',

                'modal3-text':'レバレッジドクリプトファーミング',
                'modal33-text':'O2-Protocol – レバレッジド クリプト ファーミングで受動的収入を生み出します。<br>ユーザーは担保付きローンにアクセスでき、担保付き担保で資本を借りて受動的収入を受け取ることができます。<br><br>O2-Protocol は、 Impermax に基づく暗号ファーミング フォークを活用しましたが、市場に出回っているすべての DeFi とは異なり、O2-Protocol は、O2-Protocol と呼ばれる O2-Protocol のネイティブ トークンに購入圧力を生み出す認証資金の炭素をクリアするなどのビジネス モデルを通じて、常に流動性プールへの資金の流れを生成します。トークン。<br>O2PR トークンの機能は、ローン料金の支払いに役立つだけでなく、資金調達するプロジェクトの選択、レバレッジド暗号農業における流動性資金の作成の選択のための投票権も持ちます。プラットフォーム自体の利益にもアクセスできますスマート コントラクトで保持および入金された金額、およびその他の多くのオプションに基づいて比例します。<br><br>O2-Protocol は、認定した各プロジェクトから利益を得ることができます。収益のほとんどは、レバレッジド流動性プールにより多くの資金を追加することに向けられるためです。 O2PRトークン市場でより高い評価価値につながるクリプトファーミングに。',
                
                //LEAVE US MESSAGE
                'leave':'メッセージを残してください',
                'firstname':'ファーストネーム',
                'lastname':'苗字',
                'phone':'電話',
                'email':'Eメール',
                'message':'メッセージ',
                'submit':'メッセージを送信',

                //CONTACT US
                'contactus':'お問い合わせ',

                //NEWSLETTER
                'news-title':'ニュースレター',
                'news-text':'ICO キャンペーンの更新にサインアップしてください。',
                'news-name':'フルネーム',
                'news-email':'Eメール',
                'news-submit':'送信',


                //bottom
                'company-title':'O2プロトコル',
                'about-bottom':'だいたい',
                'team-bottom':'チーム',
                'blog-bottom':'ブログ',
                'contact-bottom':'コンタクト',

                'ico-funding':'ICO資金調達',
                'bottom-feature': '特徴',
                'bottom-product': '製品',
                'bottom-roadmap': 'ロードマップ',
                'bottom-token':'Toトークンken',
            }
        }
        
        

       
        // Define a function to update the text in the banner based on the selected language
        function updateBannerText(Lang) {
            
            //top banners titles
            const topFeatures = document.querySelector('[data-translate="top-features"]');
            const topProduct = document.querySelector('[data-translate="top-products"]');
            const topRoadmap = document.querySelector('[data-translate="top-roadmap"]');
            const topAbout = document.querySelector('[data-translate="top-about"]');
            const topTeam = document.querySelector('[data-translate="top-team"]');
            const topToken = document.querySelector('[data-translate="top-token"]');
            const topBlog = document.querySelector('[data-translate="top-blog"]');
            const topContact = document.querySelector('[data-translate="top-contact"]');
            const Connect = document.querySelector('[data-translate="connect"]');
            const DisconnectButton = document.getElementById('disco');
            

            //TITLE
            const bannerTitle = document.querySelector('[data-translate="banner-title"]');
            const bannerDescription = document.querySelector('[data-translate="banner-description"]');
           

            //ICO clock
            const Whitepaper = document.querySelector('[data-translate="whitepaper"]');
            const introVideo = document.querySelector('[data-translate="intro-video"]');
            const playIcon = document.createElement('i');
            playIcon.className = 'fas fa-play';
            const FinancialText1 = document.querySelector('[data-translate="financial-text1"] h4');
            const ConnectWallet = document.getElementById('connectButton');
            const PurchaseO2p = document.getElementById('purchaseButton');

            //video
            //const videoLink = document.querySelector('.video-popup');

            //get whitelisted
            const GetWhiteListed = document.querySelector('[data-translate="getwhitelisted"]');
            const ToParticipate = document.querySelector('[data-translate="toparticipate"]');
            const ToParticipate2 = document.querySelector('[data-translate="toparticipate2"]');
            const ToParticipate3 = document.querySelector('[data-translate="toparticipate3"]');
            const ToParticipate4 = document.querySelector('[data-translate="toparticipate4"]');
            const ToParticipate5 = document.querySelector('[data-translate="toparticipate5"]');
            const ToParticipate6 = document.querySelector('[data-translate="toparticipate6"]');
            
            
            //how to claim
            const HowToClaim = document.querySelector('[data-translate="howtoclaim"]');
            const HowToClaim2 = document.querySelector('[data-translate="howtoclaim2"]');

            
            //how it works
            const HowItWorks = document.querySelector('[data-translate="howitworks"]');
            const StepHow = document.querySelector('[data-translate="stephow"]');
            
            const StepHow2 = document.querySelector('[data-translate="stephow2"]');
            const StepHow3 = document.querySelector('[data-translate="stephow3"]');
            const StepHow4 = document.querySelector('[data-translate="stephow4"]');
            const StepHow5 = document.querySelector('[data-translate="stephow5"]');
            
            
            //business model
            const BusinessModel = document.querySelector('[data-translate="business-model"]');
            const O2PToken = document.querySelector('[data-translate="o2p-token"]');
            const FinanceCarbon = document.querySelector('[data-translate="finance-carbon"]');
            const FinanceBanner = document.querySelector('[data-translate="finance-banner"]');
            const MonetizationBanner = document.querySelector('[data-translate="monetization-banner"]');
            const MonetizationText = document.querySelector('[data-translate="monetization-text"]');
            const SmartText = document.querySelector('[data-translate="smart-text"]');
            const SmartBanner = document.querySelector('[data-translate="smart-banner"]');
            const RetireBanner = document.querySelector('[data-translate="retire-banner"]');
            const RetireText = document.querySelector('[data-translate="retire-text"]');

            const TokenizationBanner = document.querySelector('[data-translate="tokenization-banner"]');
            const TokenizationText = document.querySelector('[data-translate="tokenization-text"]');

            const FarmingBanner = document.querySelector('[data-translate="farming-banner"]');
            const Farmingtext = document.querySelector('[data-translate="farming-text"]');

            const PriceBanner = document.querySelector('[data-translate="price-banner"]');
            const Pricetext = document.querySelector('[data-translate="price-text"]');

            const StakeBanner = document.querySelector('[data-translate="stake-banner"]');
            const Staketext = document.querySelector('[data-translate="stake-text"]');

            //PRODUCT DETAILS
            const ProductTitle = document.querySelector('[data-translate="product-title"]');
            const ProductText = document.querySelector('[data-translate="product-text"]');
            const Producta = document.querySelector('[data-translate="product-a"]');
            const Productb = document.querySelector('[data-translate="product-b"]');
            const Productc = document.querySelector('[data-translate="product-c"]');

            const LeverageTitle = document.querySelector('[data-translate="leverage-title"]');
            const LeverageText = document.querySelector('[data-translate="leverage-text"]');
            const TokenizationProductTitle = document.querySelector('[data-translate="tokenization-product-title"]');
            const TokenizationProductText = document.querySelector('[data-translate="tokenization-product-text"]');
            const FinancingTitle = document.querySelector('[data-translate="financing-title"]');
            const FinancingText = document.querySelector('[data-translate="financing-text"]');

            //ROADMAP

            const RoadmapTitle = document.querySelector('[data-translate="roadmap-title"]');
            const RoadmapDescription = document.querySelector('[data-translate="roadmap-description"]');
            const Roadmap1 = document.querySelector('[data-translate="roadmap1"]');
            const Roadmap1Description = document.querySelector('[data-translate="roadmap1-description"]');

            const Roadmap2 = document.querySelector('[data-translate="roadmap2"]');
            const Roadmap2Description = document.querySelector('[data-translate="roadmap2-description"]');

            const Roadmap3= document.querySelector('[data-translate="roadmap3"]');
            const Roadmap3Description = document.querySelector('[data-translate="roadmap3-description"]');

            const Roadmap4 = document.querySelector('[data-translate="roadmap4"]');
            const Roadmap4Description = document.querySelector('[data-translate="roadmap4-description"]');

            //ABOUT US
            const About1 = document.querySelector('[data-translate="about1"]');
            const AboutUsDescription = document.querySelector('[data-translate="aboutus-description"]');

            //OPERATING TEAM
            const TeamMembers = document.querySelector('[data-translate="team-members"]');
            const Operating = document.querySelector('[data-translate="operating"]');
            const Cesar = document.querySelector('[data-translate="cesar"]');
            const CesarTitle = document.querySelector('[data-translate="cesar-title"]');
            const Maria = document.querySelector('[data-translate="maria"]');
            const MariaTitle = document.querySelector('[data-translate="maria-title"]');
            const Ale = document.querySelector('[data-translate="ale"]');
            const AleTitle = document.querySelector('[data-translate="ale-title"]');
            const Erika = document.querySelector('[data-translate="erika"]');
            const ErikaTitle = document.querySelector('[data-translate="erika-title"]');

            //100 MILLION
            const Million = document.querySelector('[data-translate="100million"]');
            const MillionText = document.querySelector('[data-translate="100million-text"]');
            const MillionText2 = document.querySelector('[data-translate="100million-text2"]');

            //TOKEN DISTRIBUTION
            const TokenDistribution = document.querySelector('[data-translate="token-distribution"]');
            const TokenDistributionText = document.querySelector('[data-translate="token-distribution-text"]');
            const TokenText1 = document.querySelector('[data-translate="tokentext1"]');
            const TokenText2 = document.querySelector('[data-translate="tokentext2"]');
            const TokenText3 = document.querySelector('[data-translate="tokentext3"]');
            const TokenText4 = document.querySelector('[data-translate="tokentext4"]');
            const TokenText5 = document.querySelector('[data-translate="tokentext5"]');
            const TokenText6 = document.querySelector('[data-translate="tokentext6"]');

            //MEDIUM BLOG
            const MediumTitle = document.querySelector('[data-translate="medium-title"]');
            const MediumText = document.querySelector('[data-translate="medium-text"]');
            const Blog1 = document.querySelector('[data-translate="blog1"]');
            const Blog2 = document.querySelector('[data-translate="blog2"]');
            const Blog3 = document.querySelector('[data-translate="blog3"]');
            
            const MediumLink = document.querySelector('[data-translate="medium-link"]');

            //MODAL
            const Modal1Text = document.querySelector('[data-translate="modal1-text"]');
            const Modal11Text = document.querySelector('[data-translate="modal11-text"]');
            const Modal1Date = document.querySelector('[data-translate="modal1-date"]');
            
            const Modal2Text = document.querySelector('[data-translate="modal2-text"]');
            const Modal22Text = document.querySelector('[data-translate="modal22-text"]');

            const Modal3Text = document.querySelector('[data-translate="modal3-text"]');
            const Modal33Text = document.querySelector('[data-translate="modal33-text"]');
            
            //LEAVE US MESSAGE
            const LeaveUs = document.querySelector('[data-translate="leave"]');
            const FirstName = document.querySelector('[data-translate="firstname"]');
            const LastName = document.querySelector('[data-translate="lastname"]');
            const Phone = document.querySelector('[data-translate="phone"]');
            const eMail = document.querySelector('[data-translate="email"]');
            const Message = document.querySelector('[data-translate="message"]');
            const Submit = document.querySelector('[data-translate="submit"]');

            //CONTACT US
            const ContactUs = document.querySelector('[data-translate="contactus"]');

            //NEWSLETTER
            const NewsTitle = document.querySelector('[data-translate="news-title"]');
            const NewsText = document.querySelector('[data-translate="news-text"]');
            const NewsName = document.querySelector('[data-translate="news-name"]');
            const NewsEmail = document.querySelector('[data-translate="news-email"]');
            const NewsSubmit = document.querySelector('[data-translate="news-submit"]');
            
            //bottom
            const CompanyTitle = document.querySelector('[data-translate="company-title"]');
            const AboutBottom = document.querySelector('[data-translate="about-bottom"]');
            const TeamBottom = document.querySelector('[data-translate="team-bottom"]');
            const BlogBottom = document.querySelector('[data-translate="blog-bottom"]');
            const ContactBottom = document.querySelector('[data-translate="contact-bottom"]');

            const ICOFunding = document.querySelector('[data-translate="ico-funding"]');
            const BottomToken = document.querySelector('[data-translate="bottom-token"]');
            const bottomFeature = document.querySelector('[data-translate="bottom-feature"]');
            const bottomProduct = document.querySelector('[data-translate="bottom-product"]');
            const bottomRoadmap = document.querySelector('[data-translate="bottom-roadmap"]');

            
            if (translations[Lang]) {
            
            //top banner titles
            topFeatures.innerHTML = translations[Lang]['top-features'];
            topProduct.innerHTML = translations[Lang]['top-products'];
            topRoadmap.innerHTML = translations[Lang]['top-roadmap'];
            topAbout.innerHTML = translations[Lang]['top-about'];
            topTeam.innerHTML = translations[Lang]['top-team'];
            topToken.innerHTML = translations[Lang]['top-token'];
            topBlog.innerHTML = translations[Lang]['top-blog'];
            topContact.innerHTML = translations[Lang]['top-contact'];
            Connect.innerHTML = translations[Lang]['connect'];
            DisconnectButton.innerHTML = translations[Lang]['disconnect'];

            //TITLE
            bannerTitle.innerHTML = translations[Lang]['banner-title'];
            bannerDescription.innerHTML = translations[Lang]['banner-description'];
            

            //ICO clock
            Whitepaper.innerHTML = translations[Lang]['whitepaper'];
            introVideo.innerHTML = translations[Lang]['intro-video'];
            introVideo.innerHTML = `<span>${playIcon.outerHTML}</span>${translations[Lang]['intro-video']}`;
            FinancialText1.innerHTML = translations[Lang]['financial-text1'];
            ConnectWallet.innerHTML = translations[Lang]['connectwallet'];
            PurchaseO2p.innerHTML = translations[Lang]['purchase-o2p'];

            //video
            //videoLink.href = videoLink.dataset[lang];

            const introVideoLink = document.querySelector('.btn-play.video-popup');
            introVideoLink.href = translations[Lang]['intro-video-url'];
                        
            //get whitelisted
            GetWhiteListed.innerHTML = translations[Lang]['getwhitelisted'];
            ToParticipate.innerHTML = translations[Lang]['toparticipate'];
            ToParticipate2.innerHTML = translations[Lang]['toparticipate2'];
            ToParticipate3.innerHTML = translations[Lang]['toparticipate3'];
            ToParticipate4.innerHTML = translations[Lang]['toparticipate4'];
            ToParticipate5.innerHTML = translations[Lang]['toparticipate5'];
            ToParticipate6.innerHTML = translations[Lang]['toparticipate6'];
            

            //how to claim
            HowToClaim.innerHTML = translations[Lang]['howtoclaim'];
            HowToClaim2.innerHTML = translations[Lang]['howtoclaim2'];
            
            //how it works
            HowItWorks.innerHTML = translations[Lang]['howitworks'];
            StepHow.innerHTML = translations[Lang]['stephow'];

            StepHow2.innerHTML = translations[Lang]['stephow2'];
            StepHow3.innerHTML = translations[Lang]['stephow3'];
            StepHow4.innerHTML = translations[Lang]['stephow4'];
            StepHow5.innerHTML = translations[Lang]['stephow5'];


            //business model
            BusinessModel.innerHTML = translations[Lang]['business-model'];
            O2PToken.innerHTML = translations[Lang]['o2p-token'];
            FinanceCarbon.innerHTML = translations[Lang]['finance-carbon'];
            FinanceBanner.innerHTML = translations[Lang]['finance-banner'];
            MonetizationBanner.innerHTML = translations[Lang]['monetization-banner'];
            MonetizationText.innerHTML = translations[Lang]['monetization-text'];
            SmartBanner.innerHTML = translations[Lang]['smart-banner'];
            SmartText.innerHTML = translations[Lang]['smart-text'];
            RetireBanner.innerHTML = translations[Lang]['retire-banner'];
            RetireText.innerHTML = translations[Lang]['retire-text'];

            TokenizationBanner.innerHTML = translations[Lang]['tokenization-banner'];
            TokenizationText.innerHTML = translations[Lang]['tokenization-text'];

            FarmingBanner.innerHTML = translations[Lang]['farming-banner'];
            Farmingtext.innerHTML = translations[Lang]['farming-text'];
            
            PriceBanner.innerHTML = translations[Lang]['price-banner'];
            Pricetext.innerHTML = translations[Lang]['price-text'];

            StakeBanner.innerHTML = translations[Lang]['stake-banner'];
            Staketext.innerHTML = translations[Lang]['stake-text'];

            //PRODUCT DETAILS
            ProductTitle.innerHTML = translations[Lang]['product-title'];
            ProductText.innerHTML = translations[Lang]['product-text'];
            Producta.innerHTML = translations[Lang]['product-a'];
            Productb.innerHTML = translations[Lang]['product-b'];
            Productc.innerHTML = translations[Lang]['product-c'];

            LeverageTitle.innerHTML = translations[Lang]['leverage-title'];
            LeverageText.innerHTML = translations[Lang]['leverage-text'];
            TokenizationProductTitle.innerHTML = translations[Lang]['tokenization-product-title'];
            TokenizationProductText.innerHTML = translations[Lang]['tokenization-product-text'];
            FinancingTitle.innerHTML = translations[Lang]['financing-title'];
            FinancingText.innerHTML = translations[Lang]['financing-text'];

            //ROADMAP
            RoadmapTitle.innerHTML = translations[Lang]['roadmap-title'];
            RoadmapDescription.innerHTML = translations[Lang]['roadmap-description'];
            Roadmap1.innerHTML = translations[Lang]['roadmap1'];
            Roadmap1Description.innerHTML = translations[Lang]['roadmap1-description'];

            Roadmap2.innerHTML = translations[Lang]['roadmap2'];
            Roadmap2Description.innerHTML = translations[Lang]['roadmap2-description'];

            Roadmap3.innerHTML = translations[Lang]['roadmap3'];
            Roadmap3Description.innerHTML = translations[Lang]['roadmap3-description'];

            Roadmap4.innerHTML = translations[Lang]['roadmap4'];
            Roadmap4Description.innerHTML = translations[Lang]['roadmap4-description'];

            //OPERATING TEAM
            TeamMembers.innerHTML = translations[Lang]['team-members'];
            Operating.innerHTML = translations[Lang]['operating'];
            Cesar.innerHTML = translations[Lang]['cesar'];
            CesarTitle.innerHTML = translations[Lang]['cesar-title'];
            Maria.innerHTML = translations[Lang]['maria'];
            MariaTitle.innerHTML = translations[Lang]['maria-title'];
            Ale.innerHTML = translations[Lang]['ale'];
            AleTitle.innerHTML = translations[Lang]['ale-title'];
            Erika.innerHTML = translations[Lang]['erika'];
            ErikaTitle.innerHTML = translations[Lang]['erika-title'];

            //100 MILLION
            Million.innerHTML = translations[Lang]['100million'];
            MillionText.innerHTML = translations[Lang]['100million-text'];
            MillionText2.innerHTML = translations[Lang]['100million-text2'];



            //ABOUT US
            About1.innerHTML = translations[Lang]['about1'];
            AboutUsDescription.innerHTML = translations[Lang]['aboutus-description'];

            //TOKEN DISTRIBUTION
            TokenDistribution.innerHTML = translations[Lang]['token-distribution'];
            TokenDistributionText.innerHTML = translations[Lang]['token-distribution-text'];

            TokenText1.innerHTML = translations[Lang]['tokentext1'];
            TokenText2.innerHTML = translations[Lang]['tokentext2'];
            TokenText3.innerHTML = translations[Lang]['tokentext3'];
            TokenText4.innerHTML = translations[Lang]['tokentext4'];
            TokenText5.innerHTML = translations[Lang]['tokentext5'];
            TokenText6.innerHTML = translations[Lang]['tokentext6'];   
            
            //MEDIUM BLOG
            MediumTitle.innerHTML = translations[Lang]['medium-title'];
            MediumText.innerHTML = translations[Lang]['medium-text'];
            MediumLink.innerHTML = translations[Lang]['medium-link'];
            Blog1.innerHTML = translations[Lang]['blog1'];
            Blog2.innerHTML = translations[Lang]['blog2'];
            Blog3.innerHTML = translations[Lang]['blog3'];
            

            //MODAL
            Modal1Text.innerHTML = translations[Lang]['modal1-text'];
            Modal11Text.innerHTML = translations[Lang]['modal11-text'];
            Modal1Date.innerHTML = translations[Lang]['modal1-date'];

            Modal2Text.innerHTML = translations[Lang]['modal2-text'];
            Modal22Text.innerHTML = translations[Lang]['modal22-text'];

            Modal3Text.innerHTML = translations[Lang]['modal3-text'];
            Modal33Text.innerHTML = translations[Lang]['modal33-text'];

            //LEAVE US MESSAGE
            LeaveUs.innerHTML = translations[Lang]['leave'];
            FirstName.placeholder = translations[Lang]['firstname'];
            LastName.placeholder = translations[Lang]['lastname'];
            Phone.placeholder = translations[Lang]['phone'];
            eMail.placeholder = translations[Lang]['email'];
            Message.placeholder = translations[Lang]['message'];
            Submit.innerHTML = translations[Lang]['submit'];
            
            //CONTACT US
            ContactUs.innerHTML = translations[Lang]['contactus'];

            //NEWSLETTER
            NewsTitle.innerHTML = translations[Lang]['news-title'];
            NewsText.innerHTML = translations[Lang]['news-text'];
            NewsName.placeholder = translations[Lang]['news-name'];
            NewsEmail.placeholder = translations[Lang]['news-email'];
            NewsSubmit.innerHTML = translations[Lang]['news-submit'];

            //bottom
            CompanyTitle.innerHTML = translations[Lang]['company-title'];
            AboutBottom.innerHTML = translations[Lang]['about-bottom'];
            TeamBottom.innerHTML = translations[Lang]['team-bottom'];
            BlogBottom.innerHTML = translations[Lang]['blog-bottom'];
            ContactBottom.innerHTML = translations[Lang]['contact-bottom'];

            ICOFunding.innerHTML = translations[Lang]['ico-funding'];
            BottomToken.innerHTML = translations[Lang]['bottom-token'];
            bottomFeature.innerHTML = translations[Lang]['bottom-feature'];
            bottomProduct.innerHTML = translations[Lang]['bottom-product'];
            bottomRoadmap.innerHTML = translations[Lang]['bottom-roadmap'];

            }
        }
        
        

        
        // Add an event listener to the language selector dropdown to update the banner text when a new language is selected
        const languageDropdown = document.querySelector('.o-langualge .dropdown-menu');
        languageDropdown.addEventListener('click', function(event) {
            const selectedLanguage = event.target.innerText.toLowerCase();
            updateBannerText(selectedLanguage);
        });
  

    //Background image rotation on scroll
    function AnimateRotate(d) {
        var elem = $(".banner-poly-bg");

        $({
            deg: 0
        }).animate({
            deg: d
        }, {
            duration: 2000,
            step: function (now) {
                elem.css({
                    transform: "rotate(" + now + "deg)"
                });
            }
        });
    }

    // Add scrollspy to <body>
    $('body').scrollspy({
        target: ".navbar-nav",
        offset: 100
    });

    //script for page scroll to top and bottom
    _document.on('click', '.navbar-nav li a:not(.dropdown-toggle),.footer-widget li a, .page-scroll', function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 800, 'easeInOutExpo');
                return false;
            }
        }
    });

    //Wow js
    var wow = new WOW({
        boxClass: 'wow', // animated element css class (default is wow)
        animateClass: 'animated', // animation css class (default is animated)
        offset: 200, // distance to the element when triggering the animation (default is 0)
        mobile: true, // trigger animations on mobile devices (default is true)
        live: true, // act on asynchronously loaded content (default is true)
        callback: function (box) {
            // the callback is fired every time an animation is started
            // the argument that is passed in is the DOM node being animated
        },
        scrollContainer: null // optional scroll container selector, otherwise use window
    });
    wow.init();




    //jQuery countdown plugin

    /*$('#clock').countdown('2023/03/01').on('update.countdown', function (event) {
        var _DateInput = '' +
        '<div><span>%-D</span> Day%!d</div>' +
        '<div><span>%H</span> Hours</div>' +
        '<div><span>%M</span> Minutes</div>' +
        '<div><span>%S</span> Seconds</div>';
        var $this = $(this).html(event.strftime(_DateInput));
    });*/

    // Set up language selector event listener
$('.dropdown-item').click(function() {
    var language = $(this).text();
    setLanguage(language);
  });
  
  // Set the initial language to English
  var language = 'EN';
  setLanguage(language);
  
  // Function to update the countdown timer based on the selected language
  function setLanguage(language) {
    // Define the translations for each language
    var translations = {
      'EN': {
        'days': 'Day%!d',
        'hours': 'Hours',
        'minutes': 'Minutes',
        'seconds': 'Seconds'
      },
      'ES': {
        'days': 'Día%!d',
        'hours': 'Horas',
        'minutes': 'Minutos',
        'seconds': 'Segundos'
      },
      'PR': {
        'days': 'Dia%!d',
        'hours': 'Horas',
        'minutes': 'Minutos',
        'seconds': 'Segundos'
      },
      'KR': {
        'days': '일%!d',
        'hours': '시간',
        'minutes': '분',
        'seconds': '초'
      },
      'CH': {
        'days': '天%!d',
        'hours': '小时',
        'minutes': '分钟',
        'seconds': '秒'
      },
      'JP': {
        'days': '%-d日',
        'hours': '%-H時間',
        'minutes': '%-M分',
        'seconds': '%-S秒'
      }
    };
  
    // Update the countdown timer with the appropriate translations
    var _DateInput = '' +
      '<div><span>%-D</span> ' + translations[language]['days'] + '</div>' +
      '<div><span>%H</span> ' + translations[language]['hours'] + '</div>' +
      '<div><span>%M</span> ' + translations[language]['minutes'] + '</div>' +
      '<div><span>%S</span> ' + translations[language]['seconds'] + '</div>';
    $('#clock').countdown('2023/04/03').on('update.countdown', function(event) {
      var $this = $(this).html(event.strftime(_DateInput));
    });
  }
  

    //progress bar
    $(".progress").each(function () {
        $(this).waypoint(function () {
            $('.progress-bar').progressbar({
                transition_delay: 100
            });
        }, {
            triggerOnce: true,
            offset: 'bottom-in-view'
        });
    });

    // Clients slider
    $('.c-onepage-clients-slider').slick({
        // dots: true,
        infinite: true,
        speed: 200,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [{
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });

    //script for popup video modal 
    $('.video-popup').magnificPopup({
        type: 'iframe',
        iframe: {
            markup: '<div class="mfp-iframe-scaler">' +
                '<div class="mfp-close">fssdfsdf</div>' +
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                '</div>',
            patterns: {
                youtube: {
                    index: 'youtube.com/',
                    id: 'v=',
                    src: '//www.youtube.com/embed/%id%?autoplay=1'
                }
            },
            srcAction: 'iframe_src'
        },
        closeMarkup: '<button title="%title%" type="button" class="mfp-close">x</button>',
        mainClass: 'mfp-fade',
        zoom: {
            enabled: true, // By default it's false, so don't forget to enable it
            duration: 300, // duration of the effect, in milliseconds
            easing: 'ease-in-out', // CSS transition easing function
            // The "opener" function should return the element from which popup will be zoomed in
            // and to which popup will be scaled down
            // By defailt it looks for an image tag:
            opener: function (openerElement) {
                // openerElement is the element on which popup was initialized, in this case its <a> tag
                // you don't need to add "opener" option if this code matches your needs, it's default one.
                return openerElement.is('img') ? openerElement : openerElement.find('img');
            }
        }
    });

    $('.o-roadmap').each(function () {
        $(this).on('click', ".o-common-card", function (e) {
            e.preventDefault();
            $(this).find('.collapse-txt').slideToggle("3000");
            $(this).find('.move-down').toggleClass("rotate");
        });
    });

    //pie chart
    AmCharts.makeChart("chartdiv", {
        "type": "pie",
        "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
        "innerRadius": "40%",
        "autoMargins": false,
        "addClassNames": true,
        "svgIcons": false,
        "colors": [
            "#448aff",
            "#543bcc",
            "#07d79c",
            "#f5354e",
            "#ff9b53",
            "#B0DE09",
            "#04D215",
            "#0D8ECF",
            "#0D52D1",
            "#2A0CD0",
            "#8A0CCF",
            "#CD0D74",
            "#754DEB",
            "#DDDDDD",
            "#999999",
            "#333333",
            "#000000",
            "#57032A",
            "#CA9726",
            "#990000",
            "#4B0C25"
        ],
        "labelsEnabled": false,
        "titleField": "category",
        "valueField": "column-1",
        "startDuration": 0,
        "allLabels": [],
        "balloon": {},
        "titles": [],
        "dataProvider": [{
                "category": "Airdrop",
                "column-1": "0.1"},
                
            {
                "category": "Development",
                "column-1": "20"
                
            },
            {
                "category": "Liquidity farming",
                "column-1": "26"
                
            },
            {
                "category": "Marketing & Advisors",
                "column-1": "8.9"
                
                
            },
            {
                "category": "Team founder",
                "column-1": "20"
                
            },
            {
                "category": "Seed, Private sale A & B",
                "column-1": "25"
                
            },
        ]
    });

    // Chart
    (function (b, i, t, C, O, I, N) {
        window.addEventListener('load', function () {
            if (b.getElementById(C)) return;
            I = b.createElement(i), N = b.getElementsByTagName(i)[0];
            I.src = t;
            I.id = C;
            N.parentNode.insertBefore(I, N);
        }, false)
    });

    //currency converter
    _document.on('click', '.o-currencies span, .o-coins span', function () {
        $(this).prevAll().removeClass('active');
        $(this).nextAll().removeClass('active');
        $(this).addClass('active');
        _convertCurrency();

    });

    function _convertCurrency() {
        var _oConverter = $('.o-converter-tab .tab-pane.active'),
            _inputAmount = _oConverter.find('.input-amount').val(),
            _pattern = /^[0-9]*$/,
            _usd = "$",
            _eur = "€",
            _isValid = _pattern.test(_oConverter.find('.input-amount').val()),
            _getInputAmount = parseInt(_oConverter.find('.input-amount').val());

        if (_oConverter.find('.usd').hasClass('active')) {
            _oConverter.find('.currency-sign').text(_usd);
            var _cValue = parseInt(_oConverter.find('.o-coins').find('span.active').attr('data-value-usd'));
        } else {
            _oConverter.find('.currency-sign').text(_eur);
            var _cValue = parseInt(_oConverter.find('.o-coins').find('span.active').attr('data-value'));
        }
        var _getTotal = _getInputAmount * _cValue;

        if (!_isValid || _oConverter.find('.input-amount').val() === "" || _oConverter.find('.input-amount').val() == undefined) {
            _oConverter.find('.value-err').fadeIn('500');
            $('.input-amount').val("");
        } else {
            _oConverter.find('.currency-total').text(_getTotal);
            _oConverter.find('.value-err').fadeOut('500');
        }
    }

    $('.o-converter').on('click', '.btn', function () {
        _convertCurrency();
    });

    $('.o-converter').on('focus keyup blur', 'input', function () {
        $(this).next('.value-err').fadeOut('500');
    });


    //flip map
    var _txt = '<i class="icon-Store"></i>VIEW MAP',
        _alterTxt = '<i class="icon-mail"></i>CONTACT US';
    $.fn.extend({
        toggleText: function (a, b) {
            return this.html(this.html() == b ? a : b);
        }
    });

    $('.o-contact-info').on('click', '.btn', function (e) {
        e.preventDefault();
        $('.flip-container').toggleClass('flip-me');
        $(".o-contact-info .btn").toggleText(_txt, _alterTxt);

        if (_window.width() < 768) {
            $('html, body').animate({
                scrollTop: $(".flip-container").offset().top - 100
            }, 1000);
        }
    });

    //Global Form validation
    $('.o-contact-form').on('submit', function (e) {
        e.preventDefault();
        var _self = $(this),
            data = $(this).serialize(),
            __selector = _self.closest('input,textarea');

        _self.closest('div').find('input,textarea').removeAttr('style');
        _self.find('.err-msg').remove();
        _self.find('.form-success').removeClass('form-success');

        $('.submit-loading-img').css('display', 'block');
        _self.closest('div').find('button[type="submit"]').attr('disabled', 'disabled');

        $.ajax({
            url: 'email/email.php',
            type: "post",
            dataType: 'json',
            data: data,
            success: function (data) {
                $('.submit-loading-img').css('display', 'none');
                _self.closest('div').find('button[type="submit"]').removeAttr('disabled');
                if (data.code == false) {
                    _self.closest('div').find('[name="' + data.field + '"]').addClass('form-success');
                    _self.closest('div').find('[name="' + data.field + '"]').after('<div class="err-msg">*' + data.err + '</div>');
                } else {
                    _self.find('textarea:last-child').after('<div class="success-msg">' + data.success + '</div>');
                    _self[0].reset();
                    setTimeout(function () {
                        $('.success-msg').fadeOut('slow');
                    }, 5000);
                }
            }
        });
    });

    // Preloader js
    function loader(_success) {
        var obj = $('.o-preloader'),
            inner = $('.o-preloader_inner');
        var w = 0,
            t = setInterval(function () {
                w = w + 1;
                inner.text(w + '%');
                if (w === 100) {
                    obj.addClass('open-page');
                    obj.addClass('hide-loader');

                    clearInterval(t);
                    w = 0;
                    if (_success) {
                        return _success();
                    }
                }
            }, 20);
    }

    //Close menu when clicked menu-items or outside
    $(".c-onepage-navbar").on('click', 'ul li a:not(.dropdown-toggle)', function () {
        $('.navbar-collapse').removeClass('show');
        $('.navbar-toggler').removeClass('change');
    });

    _document.on('click', function (e) {
        var _navMenu = $('.navbar-nav li');
        if ($('.navbar-collapse').hasClass('show')) {
            if (!_navMenu.is(e.target) && _navMenu.has(e.target).length === 0) {
                $('.navbar-collapse').removeClass('show');
                $(".navbar-toggler").removeClass('change');
            }
        }
    });

    // show hide subnav depending on scroll direction
    var _position = 0;

    _window.on('scroll', function () {
        var _scroll = $(this).scrollTop();

        if (_position > _scroll) {
            $('.banner-poly-bg-1').css({
                "bottom": "-=5px"
            });
            $('.banner-poly-bg-2').css({
                "bottom": "-=5px"
            });
            $('.banner-poly-bg-3').css({
                "bottom": "-=5px"
            });
        } else if (_scroll > _position) {
            $('.banner-poly-bg-1').css({
                "bottom": "+=5px"
            });
            $('.banner-poly-bg-2').css({
                "bottom": "+=5px"
            });
            $('.banner-poly-bg-3').css({
                "bottom": "+=5px"
            });
        }

        _position = _scroll;
    });

    //Preloader
    loader();

}());


//Google map
/*function initMap() {
    var _location = {
        lat: 40.712811,
        lng: -73.997745
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: _location
    });
    var marker = new google.maps.Marker({
        position: _location,
        map: map
        // icon: "images/marker.png"
    });
}*/

window.connectMetaMask = connectMetaMask;

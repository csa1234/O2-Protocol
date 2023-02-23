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
    
    // ...
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
        const contractAddress = "0xd173D3b057eB8Feb8DE766e15c08173989b98a15";
        const abi = [
          {
            "inputs": [],
            "name": "buyTokens",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "rate",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ];
  
        // Create a new contract instance
        const contract = new web3.eth.Contract(abi, contractAddress);
  
        // Get the amount of tokens from the input field
        const amount = document.getElementById("_amount").value;
  
        // Get the rate from the contract
        const rate = await contract.methods.rate().call();
        
        //set rate value
        var currentRate;
        if (rate == 1) {
            currentRate = 0.45;
            
        } else if (rate == 2) {
            currentRate == 0.65;
           
        } else if (rate == 3) {
            currentRate == 0.85;

        }
  
        // Calculate the amount of tokens to purchase based on the rate
        const tokensToPurchase = (amount / currentRate);
  
        // Convert amount to wei
        const amountWei = web3.utils.toWei(amount, "ether");
  
        // Send transaction to the contract
        const result = await contract.methods.buyTokens().send({
          from: account,
          value: amountWei
        });
  
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

// Connect to MetaMask
function connectMetaMask() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
      web3 = new Web3(window.ethereum);
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(async function (accounts) {
        // Store the connected account information in local storage
        localStorage.setItem("connectedAccount", accounts[0]);
        // Hide the connect button
        document.getElementById("connectButton").style.display = 'none';
        
        
        
  
        // Define the vesting contract ABI and address
        const vestingAddress = "0xd173D3b057eB8Feb8DE766e15c08173989b98a15";
        const vestingABI = [{
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "vestingInfo",
          "outputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "totalVestedTokens",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "dailyVestedTokens",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "claimAmount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }];
  
          // Change the button to display disconnect
          const connectButton = document.getElementById("connectButton2");
          connectButton.innerHTML = "Discon.";
          

          connectButton.onclick = disconnectMetaMask;
          document.querySelector('a.btn.secondary-btn[onclick="purchaseTokens()"]').style.display = "block";
          document.getElementById("progressText").style.display = "block";
          document.querySelector(".progress").style.display = "block";
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
          const totalVestedTokens = web3.utils.fromWei(info.totalVestedTokens, "ether");
          account.innerHTML += `<br>Total token O2P purchased: ${totalVestedTokens}`;
        }).catch(function(err) {
          /*console.error(err);
          alert('Error retrieving vesting information');*/
          
        });
  
      }).catch(function(err) {
        console.error(err);
        alert('Please install Metamask Wallet: https://metamask.io');
      });
    } else {
      alert('Please install MetaMask');
    }
  }
  
  
  
  function disconnectMetaMask() {
    // Clear the connected account information from local storage
    localStorage.removeItem("connectedAccount");
  
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
            
            //top banners titles
            'top-features': 'Features',
            'top-products': 'Products',
            'top-roadmap': 'Roadmap',
            'top-about': 'About',
            'top-team': 'Team',
            'top-token': 'Token',
            'top-contact': 'Contact',
            'connect': 'Connect',
            
            
            //middle description
            'banner-title': 'Carbon offset financing & leveraged farming<br>Regenerative DeFi',
            'banner-description': 'Leveraged farming with carbon offset tokens generating money flow<br>income thru the financing of carbon offset projects certification & tokenization.',
            'whitepaper': 'WHITEPAPER',
            'intro-video': 'Intro Video',
            'financial-text1': 'SEED ROUND STARTS IN',
            //'PRIVATE ROUND A STARTS IN',
            //'PRIVATE ROUND B STARTS IN',

            'connectwallet':'CONNECT WALLET',


            //get whitelisted
            'getwhitelisted':'Get whitelisted to participate:',
            'toparticipate':'To participate on the Financial rounds & airdrop, please complete the tasks on the following link:<br><a href="http//:www......">Please go to http//:www......</a>',
            
            //how to claim
            'howtoclaim':'How to claim your purchased tokens:',
            'howtoclaim2':'After all financial rounds end, you will be able to claim your purchased tokens at a vesting rate of 0.27% daily<br>While you receive your vesting tokens, you will also receive yield income from the staking vault for the locked remaining vested tokens',
            
            //how it works
            'howitworks':'How it works:',
            'stephow': '1) O2-Protocol will finance CO2 projects certification at Verra.org, binded with a legal agreement with the project owner<br>2) Verra certifications is then tokenized thru Toucan Protocol NFT<br>3) The NFT is then swaped to USDT<br>4) O2-Protocol keeps 50% of the USDT and 50% goes to the project owner<br>5) 50% of the USDT is swaped to buy back O2P token and remaining will be used<br>   to finance new projects certifcation and provide liquidity to the pools',
            
                
            //business model
            'business-model': 'BUSINESS MODEL',
            'o2p-token': 'O2P TOKEN',

            'finance-carbon':'Finance of carbon offset certification projects. O2-Protocol keeps 50% of the face value of the certification at market prices in DEX',
            'finance-banner': 'FINANCE',
            'monetization-banner': 'MONETIZATION',
            'monetization-text': 'Tokenization of carbon offset certificates allowing instantly the swapping for other cryptocurrencies through decentralized exchangers (DEX).',
            'smart-text': 'Receive a proportional percentage on the amount of O2P token you lock on O2-Protocol smartcontract. NFT owners will have access to exclusive and special financial benefits.',
            'smart-banner': 'SMART MANAGEMENT',

            'retire-text': 'Convert and retire your NFT carbon offset credits back into real world.',
            'retire-banner': 'RETIRE',

            'tokenization-text': 'O2-Protocol will manage certification process and tokenization of selected projects elected thru votation by smartcontract locked O2P tokens holders .',
            'tokenization-banner':'TOKENIZATION',

            'farming-text': 'Profit revenues from O2-Protocol treasury will go to liquidity pools, which will become available to users for borrowing at premium discount for leverage farming.',
            'farming-banner':'LEVERAGED FARMING',

            'price-text': 'O2-Protocol will constantly create income from real world financial assets based on carbon offset certfications and buying back O2P tokens from the market creating buy pressure, which translate to a higher O2P price value.',
            'price-banner':'PRICE STRATEGY',

            'stake-text':'Lock your O2P token on our smartcontract (stake) and receive a share of the platform overall income revenues and access to voting power on the platform proposals like projects selections and liquidity farming pools creation for the leveraged farming.',
            'stake-banner':'PASSIVE INCOME',

            //PRODUCT DETAILS
            'product-title':'Products Details',
            'product-text': 'Get to known more about our farming strategies,carbon offset projects types & aims.',
            'product-a':'PASSIVE INCOME',
            'product-b':'TOKENIZATION',
            'product-c':'FINANCING',

            'leverage-title':'Leveraged Yield Farming<br>Estimated APR between 20% - 200% on leveraged liquidity pools.',
            'leverage-text':'Liquidity pools tokens: Bitcoin, Ethereum, Matic, Litecoin, carbon offset tokens, stablecoins & O2P tokens.',

            'tokenization-product-title':'Tokenization of carbon offset projects in Paraguay, Brazil, Argentina & Uruguay (MERCOSUR)<br>Reforestation & protection of forests',
            'tokenization-product-text':'With an strategic alliance with NGOs in the MERCOSUR, O2-Protocol will<br>work forward with land owners helping them aquiring carbon offset certifications and tokenization<br>helping those project owners generate revenues income on their reforestation and/or forest protection<br>thru our platform.',

            'financing-title':'Reforestations, Solar Panels & Wind power projects',
            'financing-text':'Partnership with Solar panels & wind power companies startup projects.<br>O2-Protocol will be able to finance them and become also a shareholder.<br>Hydroelectrics will also be in the aim thru special partnership agreement with country governments in the future.',

            //ROADMAP
            'roadmap-title':'Roadmap',
            'roadmap-description':'This is our 2023 roadmap, and its possible we agregate even more tasks thru the current year.',
            'roadmap1':'<span>March, 2023</span>SEED ROUND',
            'roadmap1-description': '● Seed financial round<br>● Private Sale A<br>● Legal status establishment<br>● Private Sale B',

            'roadmap2':'<span>April, 2023</span>PROJECT LAUNCH',
            'roadmap2-description': '● First leveraged liquidity pools<br>● APP Desktop version',

            'roadmap3':'<span>July, 2023</span>NFT MARKETPLACE & BRIDGE',
            'roadmap3-description': '● Self NFT tokenization bridge<br>● Carbon offset NFT marketplace<br>● Crowdfunding platform dAPP integration<br>● Mobile APP',

            'roadmap4':'LEGAL COMPLIANCE & KYC',
            'roadmap4-description': '● Soy, Rice, Wheat & Corn commodities tokenization<br>● KYC legal compliance<br>● Anti Money Laundry legal compliance<br>● Debit card',
            
            //ABOUT US
            'aboutus': 'About Us',
            'aboutus-description': 'O2-Protocol began as a conceptual idea at the beginning of 2019.<br><br>By 2020 O2-Protocol began a pre-incubation process with the National University of Asunción, Start-up Lab division, culminating the pre-incubation process in early 2022 after a long period of research in various areas such as marketing, finance, carbon offset market, agribusiness among other areas.<br><br>In mid-2022 we started the final incubation process.<br><br>This is the first time in the entire crypto world, where a DeFi project is combined with a real business model like carbon offset trading to generate a stream of income in the crypto environment.',
                                 


            


            //bottom
            'banner-feature': 'Features',
            'bottom-product': 'Products',
            'bottom-roadmap': 'Roadmap',
            'bottom-token': 'Token',
            'top-blog':'Blog',
            



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
            
            //middle description
            'banner-title': 'Financiación de compensación de carbono y agricultura criptográfica apalancada<br>DeFi Regenerativo',
            'banner-description': 'Agricultura criptográfica apalancada con tokens de compensación de carbono que generan flujo de dinero e ingresos a través <br>de la financiación de la certificación y tokenización de proyectos de compensación de carbono.',
            'whitepaper': 'WHITEPAPER',
            'intro-video': 'Video de Introducción',
            'financial-text1': 'RONDA SEMILLA EMPIEZA EN',
            // 'RONDA PRIVADA A EMPIEZA EN',
            // 'RONDA PRIVADA B EMPIEZA EN',

            'connectwallet':'CONECTAR BILLETERA',

             //get whitelisted
            'getwhitelisted':'Consigue tu acceso de lista blanca para participar',
            'toparticipate':'Para participar en las rondas financieras y lanzamiento aéreo, complete las tareas en el siguiente enlace:<br><a href="http//:www......">Por favor ingresa a: http//:www......</a>',
            
            //how to claim
            'howtoclaim':'Cómo reclamar sus tokens comprados:',
            'howtoclaim2':'Después de que finalicen todas las rondas financieras, podrá reclamar sus tokens comprados a una tasa de adquisición del 0,27% diario<br>Mientras recibe sus tokens adquiridos, también recibirá ingresos de rendimiento de la bóveda de participación para los tokens adquiridos restantes que sigan bloqueados.',
            
            //how it works
            'howitworks':'Como funciona:',
            'stephow': '1) O2-Protocol financiará la certificación de proyectos de CO2 en Verra.org, vinculado con un acuerdo legal con el propietario del proyecto<br>2) Las certificaciones de Verra luego se tokenizan a través del Protocolo Toucan NFT<br>3) Los NFT luego se cambian a USDT<br>4) O2-Protocol se queda con el 50 % del USDT y el otro 50 % va al propietario del proyecto<br>5) El 50% del USDT se intercambia para recomprar el token O2P y se utilizará el resto<br>   para financiar la certifcación de nuevos proyectos y dotar de liquidez a las piscinas de liquidez',
            

            //business model
            'business-model': 'MODELO DE NEGOCIO',
            'o2p-token': 'TOKEN O2P',

            'finance-carbon': 'Financiación de certificación de proyectos de compensación de carbono. O2-Protocol se queda con el 50 % del valor nominal de la certificación al precio del mercado en los DEX',
            'finance-banner': 'FINANZAS',
            'monetization-banner': 'MONETIZACIÓN',
            
            'monetization-text': 'Tokenización de certificados de compensación de carbono que permite el intercambio instantáneo por otras criptomonedas a través de cambistas descentralizados (DEX).',
            'smart-text': 'Reciba un porcentaje proporcional sobre la cantidad de token O2P que bloquea en el contrato inteligente O2-Protocol. Los propietarios de NFT tendrán acceso a beneficios financieros exclusivos y especiales.',
            'smart-banner': 'GESTIÓN INTELIGENTE',

            'retire-text': 'Convierta y retire sus créditos de compensación de carbono NFT de vuelta al mundo real.',
            'retire-banner': 'RETIRO',


            'tokenization-text': 'O2-Protocol gestionará el proceso de certificación y tokenización de proyectos seleccionados elegidos mediante votación por titulares de tokens O2P bloqueados por contrato inteligente.',
            'tokenization-banner':'TOKENIZACIÓN',

            'farming-text': 'Los ingresos por ganancias de la tesorería de O2-Protocol se destinarán a fondos de liquidez, que estarán disponibles para que los usuarios tomen préstamos con un descuento premium para apalancar la agricultura criptográfica.',
            'farming-banner':'GANANCIAS APALANCADAS',

            'price-text': 'O2-Protocol creará constantemente ingresos a partir de activos financieros del mundo real basados ​​en certificaciones de compensación de carbono y la recompra de tokens O2P del mercado creando presión de compra, lo que se traduce en un valor de precio O2P más alto.',
            'price-banner':'ESTRATEGIA DE PRECIO',

            'stake-text':'Bloquee su token O2P en nuestro contrato inteligente (participación) y reciba una parte de los ingresos generales de la plataforma y acceso al poder de voto en las propuestas de la plataforma, como selecciones de proyectos y creación de fondos de agricultura de liquidez para la agricultura apalancada.',
            'stake-banner':'INGRESOS PASIVOS',

            'product-title':'Detalles de productos',
            'product-text': 'Conozca más sobre nuestras estrategias agrícolas, tipos de proyectos de compensación de carbono y objetivos.',
            'product-a':'INGRESOS PASIVOS',
            'product-b':'TOKENIZACIÓN',
            'product-c':'FINANCIACIÓN',


            'leverage-title':'Agricultura criptográfica con rendimiento apalancado<br>APR estimado entre 20 % y 200 % en fondos de liquidez apalancados.',
            'leverage-text':'Tokens de fondos de liquidez: Bitcoin, Ethereum, Matic, Litecoin, tokens de compensación de carbono, monedas estables y tokens O2P.',

            'tokenization-product-title':'Tokenización de proyectos de compensación de carbono en Paraguay, Brasil, Argentina y Uruguay (MERCOSUR)<br>Reforestación y protección de bosques',
            'tokenization-product-text':'Con una alianza estratégica con ONG en el MERCOSUR, O2-Protocol<br>trabajará con los propietarios de tierras ayudándolos a adquirir certificaciones de compensación de carbono y tokenización<br>ayudando a los propietarios de proyectos a generar ingresos en su reforestación y/o protección forestal< br>a través de nuestra plataforma.',

            'financing-title':'Reforestaciones, Paneles Solares y Proyectos Eólicos',
            'financing-text':'Asociación con proyectos de puesta en marcha de empresas de paneles solares y energía eólica.<br>O2-Protocol podrá financiarlos y convertirse también en accionista.<br>La energía hidroeléctrica también estará en el objetivo a través de un acuerdo de asociación especial con los gobiernos de los países en el futuro.',

            //ROADMAP
            'roadmap-title':'Hoja de ruta',
            'roadmap-description':'Esta es nuestra hoja de ruta para 2023 y es posible que agreguemos aún más tareas hasta el año en curso.',
            'roadmap1':'<span>Marzo, 2023</span>RONDA FINANCIERA: SEMILLA',
            'roadmap1-description': '● Ronda financiera semilla<br>● Venta privada A<br>● Establecimiento de estatus legal<br>● Venta privada B',

            'roadmap2':'<span>Abril, 2023</span>LANZAMIENTO DEL PROYECTO',
            'roadmap2-description': '● Primeros fondos de liquidez apalancados<br>● APP Versión escritorio',

            'roadmap3':'<span>Julio, 2023</span>MERCADO DE NFT Y PUENTE DE TOKENIZACIÓN',
            'roadmap3-description': '● Puente de tokenización NFT propio<br>● Mercado NFT de compensación de carbono<br>● Integración dAPP de la plataforma de financiación colectiva<br>● Aplicación móvil',

            'roadmap4':'<span>Noviembre, 2023</span>CUMPLIMIENTO LEGAL Y KYC',
            'roadmap4-description': '● Tokenización de materias primas de soya, arroz, trigo y maíz<br> ● Cumplimiento legal de KYC<br> ● Cumplimiento legal contra el lavado de dinero<br> ● Tarjeta de débito',


            //ABOUT US
            'aboutus': 'Sobre nosotros',
            'aboutus-description': 'O2-Protocol comenzó como una idea conceptual a principios de 2019.<br><br>Para 2020 O2-Protocol inició un proceso de pre-incubación con la Universidad Nacional de Asunción, división Start-up Lab, culminando el proceso de pre-incubación a principios de 2022 tras un largo periodo de investigación en varias áreas como marketing, finanzas, mercado de compensación de carbono, negocios agrícolas entre otras áreas.<br><br>A mediados de 2022 comenzamos el proceso de final de incubación y la etapa de resultado final es ahora.<br><br>Esta es la primera vez en todo el mundo criptográfico, donde un proyecto DeFi se combina con un modelo comercial real como el comercio de compensación de carbono para generar un flujo de ingresos en el entorno criptográfico.',


            //bottom
            'bottom-feature': 'Características',
            'bottom-product': 'Productos',
            'bottom-roadmap': 'Hoja de ruta',


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
                
                //middle description
                'banner-title': 'Financiamento de compensação de carbono e cultivo de criptomoedas alavancado Regenerative DeFi',
                'banner-description': 'Agricultura de criptografia alavancada com tokens de compensação de carbono gerando fluxo de dinheiro receita através do financiamento de certificação e tokenização de projetos de compensação de carbono.',
                'whitepaper': 'WHITEPAPER',
                'intro-video': 'Vídeo de introdução',
                'financial-text1': 'RODADA DE SEMENTES COMEÇA EM',
                //'RODADA A PRIVADA COMEÇA EM',
                //'RODADA B PRIVADA COMEÇA EM',

                'connectwallet':'CONECTAR CARTEIRA',

                //get whitelisted
                'getwhitelisted':'Obtenha seu acesso à lista de permissões para participar',
                'toparticipate':'Para participar das rodadas financeiras e airdrop, conclua as tarefas no seguinte link:<br><a href="http//:www......">Por favor vá a: http//:www. .. ...</a>',
                
                //how to claim
                'howtoclaim':'Como reivindicar seus tokens comprados:',
                'howtoclaim2':'Depois que todas as rodadas financeiras terminarem, você poderá reivindicar seus tokens comprados a uma taxa de aquisição diária de 0,27%.<br>Enquanto você recebe seus Tokens Adquiridos, você também receberá receita de desempenho do Cofre da Estaca por quaisquer Tokens Adquiridos restantes que ainda estiverem bloqueados.',
                
                //how it works
                'howitworks':'Como funciona:',
                'stephow': '1) O2-Protocol financiará a certificação de projetos de CO2 em Verra.org, vinculada a um acordo legal com o proprietário do projeto<br>2) As certificações de Verra luego são tokenizadas através do Protocolo Toucan NFT<br>3) NFTs são então alterados para USDT<br>4) O2-Protocol fica com 50% do USDT e os outros 50% vão para o dono do projeto<br>5) 50% do USDT é trocado para recomprar o token O2P e o restante será usado<br>   para financiar a certificação de novos projetos e fornecer liquidez a pools de liquidez',
                
                
                //business model
                'business-model': 'MODELO DE NEGÓCIOS',
                'o2p-token': 'TOKEN O2P',

                'finance-carbon': 'Financiamento de cert carbono. O2-Protocol fica com 50% do valor nominal do certificação a preço de mercado em DEX',
                'finance-banner': 'FINANÇA',
                'monetization-banner': 'MONETIZAÇÃO',
                'monetization-text': 'Tokenização de certificados de compensação de carbono que permite a troca instantânea por outras criptomoedas por meio de trocadores descentralizados (DEXs).',
                'smart-text': 'Receba uma porcentagem proporcional sobre a quantidade de token O2P que você bloqueia no contrato inteligente O2-Protocol. Proprietários de NFT terão acesso a benefícios financeiros exclusivos e especiais.',
                'smart-banner': 'GESTÃO INTELIGENTE',

                'retire-text': 'Converta e retire seus créditos de compensação de carbono NFT de volta ao mundo real.',
                'retire-banner': 'RETIRADA',



                'tokenization-text': 'O2-Protocol gerenciará o processo de certificação e tokenização de projetos selecionados eleitos por meio de votação por detentores de tokens O2P bloqueados por contrato inteligente.',
                'tokenization-banner':'TOKENIZAÇÃO',

                'farming-text': 'As receitas de lucro da tesouraria O2-Protocol irão para pools de liquidez, que ficarão disponíveis aos usuários para empréstimos com desconto premium para alavancar o cultivo de criptomoedas.',
                'farming-banner':'LUCROS ALAVANADOS',

                'price-text': 'O2-Protocol criará constantemente receita de ativos financeiros do mundo real com base em certificações de compensação de carbono e recomprando tokens O2P do mercado, criando pressão de compra, que se traduz em um valor de preço O2P mais alto.',
                'price-banner':'ESTRATÉGIA DE PREÇOS',

                'stake-text':'Bloqueie seu token O2P em nosso contrato inteligente (aposta) e receba uma parte das receitas gerais da plataforma e acesso ao poder de voto nas propostas da plataforma, como seleções de projetos e criação de pools de agricultura de liquidez para a agricultura alavancada.',
                'stake-banner':'INGRESSOS PASSIVOS',


                'product-title':'Detalhes dos produtos',
                'product-text': 'Conheça mais sobre nossas estratégias agrícolas, tipos e objetivos de projetos de compensação de carbono.',
                'product-a':'INGRESSOS PASSIVOS',
                'product-b':'TOKENIZAÇÃO',
                'product-c':'FINANCIAMENTO',


                'leverage-title':'Cultivo de criptografia de rendimento alavancado<br> APR estimado entre 20% e 200% em pools de liquidez alavancados.',
                'leverage-text':'Tokens de pools de liquidez: Bitcoin, Ethereum, Matic, Litecoin, tokens de compensação de carbono, stablecoins e tokens O2P.',

                'tokenization-product-title':'Tokenização de projetos de compensação de carbono no Paraguai, Brasil, Argentina e Uruguai (MERCOSUL)<br>Reflorestamento e proteção de florestas',
                'tokenization-product-text':'Com uma aliança estratégica com ONGs no MERCOSUL, O2-Protocol<br>trabalhará adiante com os proprietários de terras, ajudando-os a adquirir certificações de compensação de carbono e tokenização<br>ajudando os proprietários de projetos a gerar receita com seu reflorestamento e/ou proteção florestal< br>através da nossa plataforma.',

                'financing-title':'Projetos de reflorestamento, painéis solares e energia eólica',
                'financing-text':'Parceria com projetos de inicialização de empresas de painéis solares e energia eólica.<br>O2-Protocol poderá financiá-los e também se tornar um acionista.<br>As hidrelétricas também estarão no objetivo por meio de um acordo de parceria especial com os governos dos países no futuro.',

                //ROADMAP
                'roadmap-title':'Roteiro',
                'roadmap-description':'Este é o nosso roteiro para 2023, e é possível que agreguemos ainda mais tarefas ao longo deste ano.',
                'roadmap1':'<span>MARÇO, 2023</span>RODADA FINANCEIRA: SEMENTE',
                'roadmap1-description': '● Rodada financeira semente<br>● Venda Privada A<br>● Constituição do Estatuto Jurídico<br>● Venda Privada B',

                'roadmap2':'<span>Abril de 2023</span>LANÇAMENTO DO PROJETO',
                'roadmap2-description': '● Primeiros fundos de liquidez alavancados<br>● Versão APP Desktop',

                'roadmap3':'<span>julho de 2023</span>MERCADO NFT E PONTE DE TOKENIZAÇÃO',
                'roadmap3-description': '● Ponte de tokenização de auto NFT<br>● Mercado NFT de compensação de carbono<br>● Plataforma de crowdfunding integração dAPP<br>● APP móvel',

                'roadmap4':'<span>Novembro de 2023</span>CONFORMIDADE LEGAL E KYC',
                'roadmap4-description': '● Tokenização de commodities de soja, arroz, trigo e milho<br>● Conformidade legal KYC<br>● Conformidade legal antilavagem de dinheiro<br>● Cartão de débito',

                //ABOUT US
                'aboutus': 'Sobre nós',
                'aboutus-description': 'O2-Protocol começou como uma ideia conceitual no início de 2019.<br><br>Em 2020, O2-Protocol iniciou um processo de pré-incubação com a Universidade Nacional de Assunção, divisão de Start-up Lab, culminando no processo de pré-incubação no início de 2022 após um longo período de pesquisa em diversas áreas como marketing, finanças, mercado de compensação de carbono, agronegócio entre outras áreas.<br><br>Em meados de 2022 iniciamos o processo final de incubação.<br><br> Esta é a primeira vez em todo o mundo criptográfico, onde um projeto DeFi é combinado com um modelo de negócios real, como o comércio de compensação de carbono, para gerar um fluxo de renda no ambiente criptográfico.',
                    
                
                //bottom
                'bottom-feature': 'Características',
                'bottom-product': 'Productos',
                'bottom-roadmap': 'Hoja de ruta',
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
                
                
                //middle description
                'banner-title': '탄소 상쇄 금융 및 레버리지 암호화 농업 재생 DeFi',
                'banner-description': '자금 흐름을 생성하는 탄소 상쇄 토큰으로 레버리지 암호화 농업 탄소 상쇄 프로젝트 인증 및 토큰화 자금 조달을 통한 수입.',
                'whitepaper': '백지',
                'intro-video': '소개 영상',
                'financial-text1': '시드 라운드 시작',
                //'프라이빗 라운드 A 시작',
                //'프라이빗 라운드 B는 에서 시작합니다.',

                'connectwallet':'지갑 연결',

                //get whitelisted
                'getwhitelisted':'참여할 수 있도록 허용 목록에 추가:',
                'toparticipate':'파이낸셜 라운드 및 에어드롭에 참여하려면 다음 링크에서 작업을 완료하십시오.<br><a href="http//:www......">다음으로 이동하십시오. http//:www......</a>',
                
                //how to claim
                'howtoclaim':'구매한 토큰을 청구하는 방법:',
                'howtoclaim2':'모든 재정 라운드가 종료되면 매일 0.27%의 베스팅 비율로 구매한 토큰을 청구할 수 있습니다.<br>베스팅 토큰을 받는 동안 잠긴 나머지 베스팅 토큰에 대한 스테이킹 금고의 수익도 받게 됩니다.',

                //how it works
                'howitworks':'작동 방식:',
                'stephow': '1) O2 프로토콜은 Verra.org에서 CO2 프로젝트 인증에 자금을 지원하며 프로젝트 소유자와의 법적 계약에 구속됩니다.<br>2) 그런 다음 Verra 인증은 Toucan Protocol NFT를 통해 토큰화됩니다.<br>3) 그런 다음 NFT는 Toucan Protocol BCT 토큰으로 전환되고 USDT로 스왑됩니다.<br>4) O2-Protocol은 USDT의 50%를 보유하고 50%는 프로젝트 소유자에게 전달됩니다.<br>5) USDT의 50%는 O2P 토큰을 환매하기 위해 스왑되고 나머지는 사용됩니다.<br>   새로운 프로젝트 인증 자금 조달 및 풀에 유동성 제공',
                

                //business model
                'business-model': '비즈니스 모델',
                'o2p-token': 'O2P 토큰',

                'finance-carbon': '탄소 상쇄 인증 프로젝트의 재정. O2-Protocol은 인증의 액면가의 50%를 DEX에서 시가로 유지합니다.',
                'finance-banner': '재원',
                'monetization-banner': '수익화',
                'monetization-text': '탈중앙화 교환기(DEX)를 통해 다른 암호화폐와 즉시 교환할 수 있는 탄소 상쇄 인증서의 토큰화.',
                'smart-text': 'O2-Protocol 스마트 계약에 잠근 O2P 토큰 양에 비례하는 비율을 받습니다. NFT 소유자는 독점적이고 특별한 금융 혜택을 받을 수 있습니다.',
                'smart-banner': '스마트 관리',

                'retire-text': 'NFT 탄소 상쇄 크레딧을 다시 현실 세계로 변환하고 폐기하십시오.',
                'retire-banner': '철수',

                'tokenization-text': 'O2-Protocol은 스마트 계약으로 잠긴 O2P 토큰 보유자의 투표를 통해 선출된 선택된 프로젝트의 인증 프로세스 및 토큰화를 관리합니다.',
                'tokenization-banner':'토큰화',

                'farming-text': 'O2-Protocol 금고의 이익 수익은 유동성 풀로 이동하여 사용자가 레버리지 농업을 위해 프리미엄 할인으로 차용할 수 있게 됩니다.',
                'farming-banner':'레버리지 수익',

                'price-text': 'O2-Protocol은 탄소 상쇄 인증을 기반으로 실제 금융 자산에서 지속적으로 수입을 창출하고 시장에서 O2P 토큰을 다시 구매하여 더 높은 O2P 가격 가치로 변환되는 구매 압력을 생성합니다.',
                'price-banner':'가격 전략',

                'stake-text':'스마트 계약(지분)에 O2P 토큰을 잠그고 플랫폼 전체 수입 수익의 일부를 받고 레버리지 농업을 위한 프로젝트 선택 및 유동성 농업 풀 생성과 같은 플랫폼 제안에 대한 투표권에 대한 액세스 권한을 받으십시오.',
                'stake-banner':'잉그레소스 파시보스',

                'product-title':'제품 세부 정보',
                'product-text': '농업 전략, 탄소 상쇄 프로젝트 유형 및 목표에 대해 자세히 알아보십시오.',
                'product-a':'잉그레소스 파시보스',
                'product-b':'토큰화',
                'product-c':'파이낸싱',

                'leverage-title':'레버리지 수익률 암호화 농업<br> 레버리지 유동성 풀에서 20%에서 200% 사이의 추정 연이율.',
                'leverage-text':'유동성 풀 토큰: 비트코인, 이더리움, 매틱, 라이트코인, 탄소 상쇄 토큰, 스테이블 코인 및 O2P 토큰.',

                'tokenization-product-title':'파라과이, 브라질, 아르헨티나 및 우루과이(MERCOSUR)의 탄소 상쇄 프로젝트 토큰화<br>삼림 재조림 및 보호',
                'tokenization-product-text':'MERCOSUR의 NGO와 전략적 제휴를 맺은 O2-Protocol은 토지 소유자와 협력하여 탄소 상쇄 인증 및 토큰화 획득을 돕고<br>프로젝트 소유자가 재조림 및/또는 산림 보호를 통해 수익을 창출하도록 돕습니다.< 우리 플랫폼을 통해.',

                'financing-title':'재조림, 태양광 패널 및 풍력 발전 프로젝트',
                'financing-text':'태양광 패널 및 풍력 발전 회사 스타트업 프로젝트와의 파트너십.<br>O2-Protocol이 자금을 조달하고 주주가 될 수도 있습니다.<br>Hydroelectrics도 향후 국가 정부와의 특별 파트너십 계약을 통해 목표로 삼을 것입니다.',

                //ROADMAP
                'roadmap-title':'로드맵',
                'roadmap-description':'이것은 우리의 2023년 로드맵이며 올해까지 더 많은 작업을 통합할 가능성이 있습니다.',
                'roadmap1':'<span>2023년 3월</span>파이낸셜 라운드: SEED',
                'roadmap1-description': '● 시드 파이낸셜 라운드<br>● 프라이빗 세일 A<br>● 법적 지위 확립<br>● 프라이빗 세일 B',

                'roadmap2':'<span>2023년 4월</span>프로젝트 런칭',
                'roadmap2-description': '● 최초의 레버리지 유동성 펀드<br>● 앱 데스크톱 버전',

                'roadmap3':'<span>2023년 7월</span>NFT 시장 및 토큰화 브리지',
                'roadmap3-description': '● 자체 NFT 토큰화 브릿지<br>● 탄소 상쇄 NFT 마켓플레이스<br>● 크라우드 펀딩 플랫폼 dAPP 통합<br>● 모바일 앱',

                'roadmap4':'<span>2023년 11월</span>법적 준수 및 KYC',
                'roadmap4-description': '● 콩, 쌀, 밀 및 옥수수 상품 토큰화<br>● KYC 법률 준수<br>● 자금 세탁 방지 법률 준수<br>● 직불 카드',

                //ABOUT US
                'aboutus': '회사 소개',
                'aboutus-description': 'O2-Protocol은 2019년 초 개념적 아이디어로 시작되었습니다.<br><br>2020년까지 O2-Protocol은 National University of Asunción, Start-up Lab 부서와 사전 인큐베이션 프로세스를 시작하여 사전 인큐베이션 프로세스를 마무리했습니다. 마케팅, 금융, 탄소 상쇄 시장, 농업 관련 비즈니스 등 다양한 분야에서 오랜 연구 끝에 2022년 초에.<br><br>2022년 중반에 최종 인큐베이션 프로세스를 시작했습니다.<br><br> DeFi 프로젝트가 탄소 상쇄 거래와 같은 실제 비즈니스 모델과 결합되어 암호화 환경에서 수입 흐름을 생성하는 것은 전체 암호화폐 세계에서 처음입니다.',

                        
                    
                //bottom
                'bottom-feature': 'Características',
                'bottom-product': 'Productos',
                'bottom-roadmap': 'Hoja de ruta',
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
                
                //middle description
                'banner-title': '碳抵消融資和槓桿加密農業再生 DeFi',
                'banner-description': '利用碳抵消代幣產生資金流的槓桿加密農業通過碳抵消項目認證和代幣化融資獲得收入。',
                'whitepaper': '白皮書',
                'intro-video': '簡介視頻',
                'financial-text1': '種子輪開始於',
                //'私人A輪開始於',
                //'私人 B 輪開始於',

                'connectwallet':'連接錢包',

                 //get whitelisted
                'getwhitelisted':'獲得白名單參與：',
                'toparticipate':'要參與財務輪次和空投，請完成以下鏈接中的任務：<br><a href="http//:www......">請前往 http//:www......</a>',
                
                //how to claim
                'howtoclaim':'如何領取您購買的代幣：',
                'howtoclaim2':'在所有財務回合結束後，您將能夠以每天 0.27% 的歸屬率領取您購買的代幣<br>當您收到您的歸屬代幣時，您還將從鎖倉中獲得鎖定的剩餘歸屬代幣的收益收入',
                
                //how it works
                'howitworks':'怎麼運行的：',
                'stephow': '1) O2-Protocol 將資助 Verra.org 上的 CO2 項目認證，並與項目所有者簽訂法律協議<br>2) 然後通過 Toucan 協議 NFT 將 Verra 認證標記化<br>3）然後NFT到USDT<br>4) O2-Protocol 保留 50% 的 USDT，50% 歸項目所有者所有<br>5) 50%的USDT兌換回購O2P代幣，剩餘部分使用<br>   為新項目認證提供資金並為資金池提供流動性',
                
                //business model
                'business-model': '商業模式',
                'o2p-token': 'O2P令牌', 

                'finance-carbon': '碳抵消認證項目的融資。 O2-Protocol 在 DEX 中按市場價格保留 50% 的通證面值',
                'finance-banner': '金融',
                'monetization-banner': '貨幣化',
                'monetization-text': '碳抵消證書的標記化，允許通過去中心化交易所 (DEX) 即時交換其他加密貨幣。',
                'smart-text': '收到您鎖定在 O2-Protocol 智能合約上的 O2P 代幣數量的比例百分比。 NFT 所有者將可以獲得獨家和特殊的經濟利益。',
                'smart-banner': '智能管理',

                'retire-text': '將您的 NFT 碳抵消額度轉換並退回現實世界。',
                'retire-banner': '退出',
                'tokenization-text': 'O2-Protocol 將管理通過智能合約鎖定的 O2P 代幣持有者投票選出的選定項目的認證過程和代幣化。',
                'tokenization-banner':'代幣化',

                'farming-text': 'O2-Protocol 資金庫的利潤收入將進入流動性池，用戶可以以溢價借款進行槓桿耕作。',
                'farming-banner':'槓桿收益',

                'price-text': 'O2-Protocol 將根據碳抵消認證不斷從現實世界的金融資產中創造收入，並從市場上回購 O2P 代幣，從而產生購買壓力，從而轉化為更高的 O2P 價格價值。',
                'price-banner':'價格策略',


                'stake-text':'將您的 O2P 代幣鎖定在我們的智能合約（股份）上，並獲得平台總收入的一部分，並獲得對平台提案的投票權，例如項目選擇和為槓桿農業創建流動性農業池。',
                'stake-banner':'被動語態',

                'product-title':'產品詳情',
                'product-text': '進一步了解我們的農業戰略、碳抵消項目類型和目標。',
                'product-a':'被動語態',
                'product-b':'代幣化',
                'product-c':'融資',

                'leverage-title':'槓桿收益加密農業<br> 槓桿流動資金池的年利率估計在 20% 到 200% 之間。',
                'leverage-text':'流動資金池代幣：比特幣、以太坊、Matic、萊特幣、碳抵消代幣、穩定幣和 O2P 代幣。',

                'tokenization-product-title':'巴拉圭、巴西、阿根廷和烏拉圭 (MERCOSUR) 的碳抵消項目代幣化<br>再造林和森林保護',
                'tokenization-product-text':'通過與 MERCOSUR 的非政府組織建立戰略聯盟，O2-Protocol 將<br>與土地所有者合作，幫助他們獲得碳抵消認證和代幣化<br>幫助這些項目所有者通過重新造林和/或森林保護產生收入< br>通過我們的平台。',

                'financing-title':'重新造林、太陽能電池板和風力發電項目',
                'financing-text':'與太陽能電池板和風力發電公司的初創項目合作。<br>O2-Protocol 將能夠為其提供資金並成為其股東。<br>水電也將在未來通過與各國政府的特殊合作協議達成目標。',

                //ROADMAP
                'roadmap-title':'路線圖',
                'roadmap-description':'這是我們的 2023 年路線圖，我們可能會在今年匯總更多任務。',
                'roadmap1':'<span>2023 年 3 月</span>融資輪：SEED',
                'roadmap1-description': '● 種子輪融資<br>● 私募A<br>● 法律地位確立<br>● 私募B',

                'roadmap2':'<span>2023 年 4 月</span>項目啟動',
                'roadmap2-description': '● 第一槓桿流動資金<br>● APP桌面版',

                'roadmap3':'<span>2023 年 7 月</span>NFT 市場和代幣化橋樑',
                'roadmap3-description': '● 自 NFT 代幣化橋樑<br>● 碳抵消 NFT 市場<br>● 眾籌平台 dAPP 集成<br>● 移動應用程序',

                'roadmap4':'<span>2023 年 11 月</span>法律合規與 KYC',
                'roadmap4-description': '● 大豆、大米、小麥和玉米商品代幣化<br>● KYC 合規性<br>● 反洗錢合規性<br>● 借記卡',

                //ABOUT US
                'aboutus': '關於我們',
                'aboutus-description': 'O2-Protocol 始於 2019 年初的概念性想法。<br><br>到 2020 年，O2-Protocol 開始與亞松森國立大學初創實驗室部門進行預孵化過程，最終完成預孵化過程在營銷、金融、碳抵消市場、農業綜合企業等各個領域進行了長期研究後，於 2022 年初啟動。<br><br>2022 年年中，我們開始了最後的孵化過程。<br><br>這是整個加密世界中第一次將 DeFi 項目與碳抵消交易等真實商業模式相結合，從而在加密環境中產生收入流。',


                    
                //bottom
                'bottom-feature': 'Características',
                'bottom-product': 'Productos',
                'bottom-roadmap': 'Hoja de ruta',
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
                
                
                //middle description
                'banner-title': 'カーボン オフセット ファイナンシングとレバレッジド クリプト ファーミング リジェネレーティブ DeFi',
                'banner-description': 'マネー フローを生成するカーボン オフセット トークンを使用した仮想通貨ファーミングの活用 カーボンオフセットプロジェクトの認証とトークン化の資金調達による収入。',
                'whitepaper': '白書',
                'intro-video': '紹介ビデオ',
                'financial-text1': 'シードラウンド開始',
                //'プライベートラウンドA開始',
                //'プライベート ラウンド B 開始時間',
                    
                'connectwallet':'コネクトウォレット',

                //get whitelisted
                'getwhitelisted':'ホワイトリストに登録して参加する:',
                'toparticipate':'ファイナンシャル ラウンドとエアドロップに参加するには、次のリンクのタスクを完了してください。<br><a href="http//:www......">http://:www にアクセスしてください......</a>',
                

                //how to claim
                'howtoclaim':'購入したトークンを請求する方法',
                'howtoclaim2':'すべてのファイナンシャル ラウンドが終了すると、購入したトークンを毎日 0.27% のベスティング レートで請求できるようになります。<br>権利確定トークンを受け取ると同時に、ロックされた残りの権利確定トークンのステーキング ボールトから収益収入も受け取ります。',
                
                //how it works
                'howitworks':'使い方：',
                'stephow': '1) O2 プロトコルは、Verra.org での CO2 プロジェクト認証に資金を提供し、プロジェクト所有者との法的契約に拘束されます。<br>2) Verra 認定は、オオハシ プロトコル NFT を介してトークン化されます。<br>3) NFT は USDT にスワップされます。<br>4) O2 プロトコルは USDT の 50% を保持し、50% はプロジェクト所有者に渡されます<br>5) USDT の 50% は O2P トークンを買い戻すためにスワップされ、残りは使用されます。<br>   新しいプロジェクトの認証に資金を提供し、プールに流動性を提供する',
                

                //business model
                'business-model': '事業の型',
                'o2p-token': 'O2Pトークン',

                'finance-carbon': 'カーボン オフセット認証プロジェクトの資金調達。 O2 プロトコルは、証明書の額面価格の 50% を DEX の市場価格で保持します。',
                'finance-banner': 'ファイナンス',
                'monetization-banner': '収益化',
                'monetization-text': '分散型交換機 (DEX) を介して他の暗号通貨との即時交換を可能にするカーボン オフセット証明書のトークン化。',
                'smart-text': 'O2-Protocol スマートコントラクトでロックした O2P トークンの量に比例したパーセンテージを受け取ります。 NFT の所有者は、排他的で特別な経済的利益にアクセスできます。',
                'smart-banner': 'スマート管理',

                'retire-text': 'NFT カーボン オフセット クレジットを変換して、現実の世界に戻します。',
                'retire-banner': '出金',

                'tokenization-text': 'O2-Protocol は、スマートコントラクトでロックされた O2P トークン保有者による投票を通じて選出された選択されたプロジェクトの認証プロセスとトークン化を管理します。',
                'tokenization-banner':'トークン化',

                'farming-text': 'O2-Protocol トレジャリーからの収益は流動性プールに送られ、ユーザーはこれを利用して、レバレッジ ファーミングのプレミアム割引価格で借りることができます。',
                'farming-banner':'レバレッジ収益',

                'price-text': 'O2-Protocol は、カーボン オフセット証明書に基づいて実世界の金融資産から常に収入を生み出し、市場から O2P トークンを買い戻して購入圧力を生み出し、O2P 価格の価値を高めます。',
                'price-banner':'価格戦略',


                'stake-text':'私たちのスマートコントラクト (ステーク) で O2P トークンをロックし、プラットフォーム全体の収入収入の一部を受け取り、プロジェクトの選択やレバレッジド ファーミングのための流動性ファーミング プールの作成などのプラットフォームの提案に対する投票権へのアクセスを受け取ります。',
                'stake-banner':'イングレソス パッシブ',

                'product-title':'製品詳細',
                'product-text': '私たちの農業戦略、カーボン オフセット プロジェクトの種類と目的について詳しく知ることができます。',
                'product-a':'イングレソス パッシブ',
                'product-b':'トークン化',
                'product-c':'資金調達',

                'leverage-title':'レバレッジドイールド クリプトファーミング<br> レバレッジド流動性プールの推定 APR は 20% から 200% です。',
                'leverage-text':'流動性プール トークン: ビットコイン、イーサリアム、マティック、ライトコイン、カーボン オフセット トークン、ステーブルコイン、O2P トークン。',

                'tokenization-product-title':'パラグアイ、ブラジル、アルゼンチン、ウルグアイでのカーボン オフセット プロジェクトのトークン化 (MERCOSUR)<br>森林再生と森林保護',
                'tokenization-product-text':'メルコスールの NGO との戦略的提携により、O2-Protocol は<br>土地所有者がカーボン オフセット認証とトークン化を取得するのを支援し、<br>これらのプロジェクト所有者が再植林および/または森林保護で収益を生み出すのを支援します<br>私たちのプラットフォームを通じて。',

                'financing-title':'植林、ソーラーパネル、風力発電プロジェクト',
                'financing-text':'ソーラー パネルおよび風力発電会社のスタートアップ プロジェクトとのパートナーシップ。<br>O2-Protocol は、それらに資金を提供し、株主にもなることができます。<br>水力発電も、将来的には各国政府との特別なパートナーシップ契約を通じて目指す予定です。',
                
                //ROADMAP
                'roadmap-title':'ロードマップ',
                'roadmap-description':'これは 2023 年のロードマップであり、今年中にさらに多くのタスクを集約する可能性があります。',
                'roadmap1':'<span>2023 年 3 月</span>ファイナンシャル ラウンド: シード',
                'roadmap1-description': '●シード資金調達ラウンド<br>●プライベートセールA<br>●法的地位確立<br>●プライベートセールB',

                'roadmap2':'<span>2023 年 4 月</span>プロジェクトの立ち上げ',
                'roadmap2-description': '● 初めて活用された流動性ファンド<br>● APP デスクトップ バージョン',

                'roadmap3':'<span>2023 年 7 月</span>NFT マーケットプレイス & トークナイゼーション ブリッジ',
                'roadmap3-description': '● セルフ NFT トークン化ブリッジ<br>● カーボン オフセット NFT マーケットプレイス<br>● クラウドファンディング プラットフォーム dAPP 統合<br>● モバイル APP',

                'roadmap4':'<span>2023 年 11 月</span>法令順守とKYC',
                'roadmap4-description': '● 大豆、米、小麦、とうもろこし商品のトークン化<br>● KYC 法への準拠<br>● アンチマネー ランドリー法への準拠<br>● デビットカード',

                //ABOUT US
                'aboutus': '私たちに関しては',
                'aboutus-description': 'O2-Protocol は 2019 年の初めに概念的なアイデアとして始まりました。<br><br>2020 年までに、O2-Protocol はアスンシオン国立大学のスタートアップ ラボ部門とのプレインキュベーション プロセスを開始し、プレインキュベーション プロセスの頂点に達しました。マーケティング、金融、カーボン オフセット市場、アグリビジネスなど、さまざまな分野での長期にわたる調査を経て、2022 年初頭に設立されました。<br><br>2022 年半ばに、最終的なインキュベーション プロセスを開始しました。<br><br>これは、DeFiプロジェクトがカーボンオフセット取引のような実際のビジネスモデルと組み合わされて、暗号環境で収入の流れを生み出す、暗号世界全体で初めてのことです。',

                

                //bottom
                'bottom-feature': 'Características',
                'bottom-product': 'Productos',
                'bottom-roadmap': 'Hoja de ruta',
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
           

            //ICO clock
            const Whitepaper = document.querySelector('[data-translate="whitepaper"]');
            const introVideo = document.querySelector('[data-translate="intro-video"]');
            const playIcon = document.createElement('i');
            playIcon.className = 'fas fa-play';
            const FinancialText1 = document.querySelector('[data-translate="financial-text1"] h4');
            const ConnectWallet = document.querySelector('[data-translate="connectwallet"]');


            //get whitelisted
            const GetWhiteListed = document.querySelector('[data-translate="getwhitelisted"]');
            const ToParticipate = document.querySelector('[data-translate="toparticipate"]');
            
            
            //how to claim
            const HowToClaim = document.querySelector('[data-translate="howtoclaim"]');
            const HowToClaim2 = document.querySelector('[data-translate="howtoclaim2"]');

            
            //how it works
            const HowItWorks = document.querySelector('[data-translate="howitworks"]');
            const StepHow = document.querySelector('[data-translate="stephow"]');
            
            
            
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
            const AboutUs = document.querySelector('[data-translate="aboutus"]');
            const AboutUsDescription = document.querySelector('[data-translate="aboutus-description"]');

            
            
            
            
            
            
            
            //bottom
            const bannerTitle = document.querySelector('[data-translate="banner-title"]');
            const bannerDescription = document.querySelector('[data-translate="banner-description"]');
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

            //ICO clock
            Whitepaper.innerHTML = translations[Lang]['whitepaper'];
            introVideo.innerHTML = translations[Lang]['intro-video'];
            introVideo.innerHTML = `<span>${playIcon.outerHTML}</span>${translations[Lang]['intro-video']}`;
            FinancialText1.innerHTML = translations[Lang]['financial-text1'];
            ConnectWallet.innerHTML = translations[Lang]['connectwallet'];
                        
            //get whitelisted
            GetWhiteListed.innerHTML = translations[Lang]['getwhitelisted'];
            ToParticipate.innerHTML = translations[Lang]['toparticipate'];
            

            //how to claim
            HowToClaim.innerHTML = translations[Lang]['howtoclaim'];
            HowToClaim2.innerHTML = translations[Lang]['howtoclaim2'];
            
            //how it works
            HowItWorks.innerHTML = translations[Lang]['howitworks'];
            StepHow.innerHTML = translations[Lang]['stephow'];


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

            //ABOUT USS
            AboutUs.innerHTML = translations[Lang]['aboutus'];
            AboutUsDescription.innerHTML = translations[Lang]['aboutus-description'];





            
            
            //bottom
            bannerTitle.innerHTML = translations[Lang]['banner-title'];
            bannerDescription.innerHTML = translations[Lang]['banner-description'];
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
    $('#clock').countdown('2023/03/01').on('update.countdown', function(event) {
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
                "column-1": "1"
            },
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
                "column-1": "8"
            },
            {
                "category": "Team founder",
                "column-1": "20"
            },
            {
                "category": "Seed, Private sale A & B",
                "column-1": "25"
            }
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

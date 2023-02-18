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
            
            
            //middle description
            'banner-title': 'Carbon offset financing & leveraged farming<br>Regenerative DeFi',
            'banner-description': 'Leveraged farming with carbon offset tokens generating money flow<br>income thru the financing of carbon offset projects certification & tokenization.',
            'intro-video': 'Intro Video',
            'financial-text1': 'SEED ROUND STARTS IN',
            //'PRIVATE ROUND A STARTS IN',
            //'PRIVATE ROUND B STARTS IN',

                     


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
            
            //middle description
            'banner-title': 'Financiación de compensación de carbono y agricultura criptográfica apalancada<br>DeFi Regenerativo',
            'banner-description': 'Agricultura criptográfica apalancada con tokens de compensación de carbono que generan flujo de dinero e ingresos a través <br>de la financiación de la certificación y tokenización de proyectos de compensación de carbono.',
            'intro-video': 'Video de Introduccion',
            'financial-text1': 'RONDA SEMILLA EMPIEZA EN',
            // 'RONDA PRIVADA A EMPIEZA EN',
            // 'RONDA PRIVADA B EMPIEZA EN',



            
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
                
                //middle description
                'banner-title': 'Financiamento de compensação de carbono e cultivo de criptomoedas alavancado Regenerative DeFi',
                'banner-description': 'Agricultura de criptografia alavancada com tokens de compensação de carbono gerando fluxo de dinheiro receita através do financiamento de certificação e tokenização de projetos de compensação de carbono.',
                'intro-video': 'Vídeo de introdução',
                'financial-text1': 'RODADA DE SEMENTES COMEÇA EM',
                //'RODADA A PRIVADA COMEÇA EM',
                //'RODADA B PRIVADA COMEÇA EM',



                
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
                
                
                //middle description
                'banner-title': '탄소 상쇄 금융 및 레버리지 암호화 농업 재생 DeFi',
                'banner-description': '자금 흐름을 생성하는 탄소 상쇄 토큰으로 레버리지 암호화 농업 탄소 상쇄 프로젝트 인증 및 토큰화 자금 조달을 통한 수입.',
                'intro-video': '소개 영상',
                'financial-text1': '시드 라운드 시작',
                //'프라이빗 라운드 A 시작',
                //'프라이빗 라운드 B는 에서 시작합니다.',



                
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
                
                //middle description
                'banner-title': '碳抵消融資和槓桿加密農業再生 DeFi',
                'banner-description': '利用碳抵消代幣產生資金流的槓桿加密農業通過碳抵消項目認證和代幣化融資獲得收入。',
                'intro-video': '簡介視頻',
                'financial-text1': '種子輪開始於',
                //'私人A輪開始於',
                //'私人 B 輪開始於',


                
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
                
                //middle description
                'banner-title': 'カーボン オフセット ファイナンシングとレバレッジド クリプト ファーミング リジェネレーティブ DeFi',
                'banner-description': 'マネー フローを生成するカーボン オフセット トークンを使用した仮想通貨ファーミングの活用 カーボンオフセットプロジェクトの認証とトークン化の資金調達による収入。',
                'intro-video': '紹介ビデオ',
                'financial-text1': 'シードラウンド開始',
                //'プライベートラウンドA開始',
                //'プライベート ラウンド B 開始時間',
                    


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
            const introVideo = document.querySelector('[data-translate="intro-video"]');
            const playIcon = document.createElement('i');
            playIcon.className = 'fas fa-play';
            const FinancialText1 = document.querySelector('[data-translate="financial-text1"] h4');

            
            


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
            introVideo.innerHTML = translations[Lang]['intro-video'];
            introVideo.innerHTML = `<span>${playIcon.outerHTML}</span>${translations[Lang]['intro-video']}`;
            FinancialText1.innerHTML = translations[Lang]['financial-text1'];
            
            
            

            
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

    $('#clock').countdown('2023/03/01').on('update.countdown', function (event) {
        var _DateInput = '' +
        '<div><span>%-D</span> Day%!d</div>' +
        '<div><span>%H</span> Hours</div>' +
        '<div><span>%M</span> Minutes</div>' +
        '<div><span>%S</span> Seconds</div>';
        var $this = $(this).html(event.strftime(_DateInput));
    });

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

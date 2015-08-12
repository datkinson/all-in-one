var enabled = false;
var socket;

var sites = [
  'http://google.com',
  'http://github.com'
];
var currentSite;
var ref;
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        window.open = cordova.InAppBrowser.open;
        // switchSite();
    }
};

function switchSite() {
  var newSite = sites[Math.floor(Math.random()*sites.length)];
  if (newSite !== currentSite) {
    currentSite = newSite;
    // ref.close();
    console.log('switching to: ' + currentSite);
    ref = cordova.InAppBrowser.open(currentSite, '_blank', 'location=no, zoom=no');
    setTimeout(function(){
      switchSite();
    }, 10000);
  } else {
    switchSite();
  }
}

function newSocket(url) {
  console.log('attempting to attach to socket');
  if(url.indexOf('http') == -1) {
    url = 'http://' + url;
  }
  console.debug(socket);
  socket = io(url);
  console.debug(socket);
  socket.on('connect', function(){
    console.debug('Socket connected');
  });

  socket.on('newUrl', function(data) {
    console.log('recieved new url: '+ data);
    ref = cordova.InAppBrowser.open(data, '_blank', 'location=no, zoom=no');
  });
}

$('.submit').click(function() {
  var newSite = $('.url').val();
  newSocket(newSite);
});

app.initialize();

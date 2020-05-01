import * as React from 'react';
// import { Platform, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

const jsCode = `
if (document.getElementById('whatsweb_toggle') === null) {
  // disable zoom
  var meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
  
  function show(mode) {
    var bodyElem = document.querySelector('body');
    var sideElem = document.getElementById('side').parentElement;
    var mainElem = sideElem.nextElementSibling;
    var buttonElem = document.getElementById('whatsweb_toggle');
  
    if (mode === 'people') {
      sideElem.style.display = 'block';
      mainElem.style.display = 'none';
      buttonElem.textContent = "👉";
    } else if (mode === 'convo') {
      sideElem.style.display = 'none';
      mainElem.style.display = 'block';
      buttonElem.textContent = "👈";
    }
    bodyElem.setAttribute('data-whatsweb-mode', mode)
  }
  
  function initialise() {
    var bodyElem = document.querySelector('body');
    bodyElem.setAttribute('data-whatsweb-init',"true");
    show('people');
  
    var appElem = document.querySelector('.app');
    appElem.style.minWidth = "unset";
  
    var paneSideElem = document.getElementById('pane-side');
    paneSideElem.addEventListener("click", function() {show('convo')}, false);
  }
  
  var interval_checkReady = setInterval(function() {
    if (document.getElementById('side') !== null) {
      clearInterval(interval_checkReady);
      initialise();
    }
  }, 250);
  
  function hasInitialised() {
    return document.querySelector('body').hasAttribute('data-whatsweb-init');
  }
  
  function toggle() {
    if (hasInitialised()) {
      var bodyElem = document.querySelector('body');
      var currentMode = bodyElem.getAttribute('data-whatsweb-mode');
  
      if (currentMode === 'people') show('convo');
      else show('people');
    } else {
      initialise();
    } 
  }
  
  function buttonOnClick() {
    if (hasInitialised()) {
      toggle();
    }
  }
  
  var button = document.createElement("Button");
  button.id="whatsweb_toggle"
  button.innerHTML = "😶";
  button.style = "top:6px;left:calc(50% - 1.5rem);position:absolute;z-index: 9999;background-color: white;border-radius: 50%;height: 3rem;width: 3rem;color: white;font-size: 1.75rem;line-height: 1rem; opacity: 0.5;"
  button.onclick = buttonOnClick;
  document.body.appendChild(button);
}
`;

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView
        originWhitelist={['*']}
        source={{ uri: 'https://web.whatsapp.com' }}
        renderError={() => alert('Alamak, something bad happened!')}
        userAgent={"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"}
        startInLoadingState={true}
        injectedJavaScript={jsCode}
        scalesPageToFit={true}
      />
    </SafeAreaView>
  );
}

/*
const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

function App2() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to React Native!</Text>
      <Text style={styles.instructions}>To get started, edit App.js</Text>
      
      <WebView
        originWhitelist={['*']}
        source={{ html: '<h1>Hello world</h1>' }}
        style={{ marginTop: 20 }}
      />
      <Text style={styles.instructions}>{instructions}</Text>
    </View>
  );
}
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  /*
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  */
});

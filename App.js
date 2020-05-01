import React, { useRef } from 'react';
// import { Platform, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

const jsCode = `
if (document.getElementById('whatsweb_toggle') === null) {
  // disable zoom
  var meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
  
  function show(mode) {
    var appElem = document.querySelector('.app');
    var contactsElem = document.getElementById('side').parentElement;
    var chatElem = contactsElem.nextElementSibling;
    var buttonElem = document.getElementById('whatsweb_toggle');
  
    if (mode === 'people') {
      contactsElem.style.display = 'block';
      chatElem.style.display = 'none';
      buttonElem.textContent = "💬";
    } else if (mode === 'convo') {
      contactsElem.style.display = 'none';
      chatElem.style.display = 'block';
      buttonElem.textContent = "🧑‍🤝‍🧑";

      // scroll into "unread messages" area
      var messagesContainer = chatElem.querySelector('.copyable-area div');
      if (messagesContainer !== null) {
        var unreadMessages = messagesContainer.querySelector('span[aria-live="off"]');

        if (unreadMessages === null) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else {
          if (unreadMessages.textContent.toLowerCase().indexOf("unread message") !== -1) {
            unreadMessages.parentElement.nextElementSibling.scrollIntoViewIfNeeded();
          }
        }
      }
    }
    appElem.setAttribute('data-whatsweb-mode', mode)
  }
  
  function initialise() {
    var appElem = document.querySelector('.app');
    appElem.setAttribute('data-whatsweb-init',"true");
    appElem.style.minWidth = "unset";
    show('people');
  
    var paneSideElem = document.getElementById('pane-side');
    paneSideElem.addEventListener("click", function() {show('convo')}, false);

    var convoDetailsContainerElem = document.getElementById('side').parentElement.previousElementSibling;
    var divsInside = convoDetailsContainerElem.querySelectorAll('div');
    for (var i = 0; i < divsInside.length; i++) {
      var item = divsInside[i];
      if (i === divsInside.length - 1) {
        item.style.width = "100%";
      } else {
        item.style.display = 'none';
      }
    }
  }
  
  var interval_checkReady = setInterval(function() {
    if (document.getElementById('side') !== null) {
      clearInterval(interval_checkReady);
      initialise();
    }
  }, 250);
  
  function hasInitialised() {
    var appElem = document.querySelector('.app');
    return appElem.hasAttribute('data-whatsweb-init');
  }
  
  function toggle() {
    if (hasInitialised()) {
      var appElem = document.querySelector('.app');
      var currentMode = appElem.getAttribute('data-whatsweb-mode');
  
      if (currentMode === 'people') show('convo');
      else show('people');
    } else {
      initialise();
    } 
  }
  
  function buttonOnClick() {
    if (document.getElementById('startup') === null) {
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

void(0);
`;

export default function App() {
  // "injectedJavascript" doesn't seem to be working (refer to issue #554 on react-native-webview github issues)
  // as a workaround, we use a ref, and use the "injectJavascript" method of the ref to inject the JS payload
  const webViewRef = useRef();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        renderError={() => alert('Alamak, something bad happen!')}
        userAgent={"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"}
        startInLoadingState={true}
        scalesPageToFit={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode={'compatibility'}
        source={{ uri: 'https://web.whatsapp.com' }}
        // injectedJavaScript={jsCode}
        onLoad={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          webViewRef.current.injectJavaScript(jsCode);
        }}
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

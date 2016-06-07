/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ToolbarAndroid,
    TouchableHighlight,
    Alert,
    ScrollView,
    Navigator
} from 'react-native';


var ProductItem = React.createClass({

    render: function () {
        var product_url = this.props.url;
        var image = this.props.image;
        var name = this.props.name;


        return <TouchableHighlight onPress={() => this._pressRow(name)}>
            <View style={styles.productContainer}>
                <Image style={styles.productImage} source={{uri: image}}/>
                <Text style={styles.productText}>
                    {name}
                </Text>
            </View>
        </TouchableHighlight>

    },
    _pressRow: function (text) {
        this.props.navigator.push({
  title: 'Product',
  component: ProductView
});
    }
});

var ProductView = React.createClass({
    render: function () {
        var name = this.props.name;
        return <View>
            {name}
        </View>
    }

});


var UnisportMobile = React.createClass({

    getInitialState: function () {
        return {
            featuredProducts: ''
        };
    },

    getFeaturedProducts: function () {
        fetch('https://www.unisport.dk/api/products/featured/', {method: "GET"})
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    featuredProducts: responseData['products'].slice(0, 20)
                });
            })
            .done();
    },

    componentDidMount: function () {
        this.getFeaturedProducts()
    },

    render: function () {

        var productNames = [];
        this.getFeaturedProducts();
        if (this.state.featuredProducts) {
            this.state.featuredProducts.forEach(function (element) {
                var name = element['name'];
                var image = element['image'];
                productNames.push(<ProductItem name={name} image={image}/>)
            });
        }

        return (
            <View style={styles.mainContainer}>
                <ToolbarAndroid
                    style={styles.toolbar}
                    actions={[{title: '', icon: require('./menu.png'), show: 'always'}]}>
                    <View style={styles.toolbar}>
                        <Image style={styles.logo} source={require('./app_logo.png')}/>
                    </View>
                </ToolbarAndroid>
                <ScrollView ref='scrollView' keyboardDismissMode='interactive'
                            style={styles.scrollView} contentContainerStyle={styles.content}>
                    {productNames}
                </ScrollView>
            </View>
        )
    }
});


var NavigatorUnisport = React.createClass({

    render: function() {
    return (
      <Navigator
          initialRoute={{id: 'IndexPage', name: 'Index'}}
          renderScene={this.renderScene.bind(this)}
          configureScene={(route) => {
            if (route.sceneConfig) {
              return route.sceneConfig;
            }
            return Navigator.SceneConfigs.FloatFromRight;
          }} />
    );
  },
  renderScene(route, navigator) {
    var routeId = route.id;
    if (routeId === 'IndexPage') {
      return (
        <SplashPage
          navigator={navigator} />
      );
    }
    if (routeId === 'ProductPage') {
      return (
        <ProductView
          navigator={navigator} />
      );
    }
  }

});

var styles = StyleSheet.create({

    logo: {
        width: 100,
        height: 56,
        paddingTop: 0,
        paddingLeft: 0,
        marginTop: 0,
        marginLeft: 0,
    },
    toolbar: {
        backgroundColor: '#0abf5a',
        flexDirection: 'row',
        height: 56,
        paddingLeft: 0,
        marginLeft: 0,
    },
    mainContainer: {
        flex: 1
    },
    content: {
        backgroundColor: 'white',
        padding: 10,
    },
    productImage: {
        width: 90,
        height: 90,
        marginTop: 5,
    },
    productContainer: {
        height: 100,
        flex: 1,
        flexDirection: 'row',
        borderColor: '#0abf5a',
        borderWidth: 1,
        margin: 2,
    },
    productText: {
        margin: 5,
        flex: 1,
        flexDirection: 'row',
        fontWeight: 'bold',
        color: 'black',
    },
    scrollView: {
        flex: 1,
    },
});

AppRegistry.registerComponent('UnisportMobile', () => UnisportMobile);
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
        var image = this.props.image;
        var name = this.props.name;


        return <TouchableHighlight onPress={() => this._pressRow()}>
            <View style={styles.productContainer}>
                <Image style={styles.productImage} source={{uri: image}}/>
                <Text style={styles.productText}>
                    {name}
                </Text>
            </View>
        </TouchableHighlight>

    },
    _pressRow: function () {
        this.props.navigator.push({
        id: 'product_view',
        product_name: this.props.name,
        product_image: this.props.image,
        product_price: this.props.price.substring(0, this.props.price.length-2) + '.' + this.props.price.substring(this.props.price.length-2),
        product_currency: this.props.currency
    });
    }
});

var ProductView = React.createClass({
    render: function () {
        var name = this.props.name;
        var image = this.props.image;
        var currency = this.props.currency;
        var price = this.props.price;
        return <View>
            <ToolbarUnisport />
                <Image style={styles.productImageLarge} source={{uri: image}}/>
                <Text style={styles.productTextLarge}>
                    {name}
                </Text>
                  <Text style={styles.price}>
                    Price: {price} {currency}
                </Text>

            <TouchableHighlight onPress={this._onPressButton}>
                <View><Text>
                     Back </Text></View>
                </TouchableHighlight>
        </View>
    },

    _onPressButton: function () {
         this.props.navigator.push({
        id: 'featured_products'});
    }

});


var ToolbarUnisport = React.createClass({
    
    render: function(){

        var toolbarActions = [
  {title: '', icon: require('./menu.png'), show: 'always'},
];
        return <ToolbarAndroid
                    style={styles.toolbar}
                    actions={toolbarActions}>
                    <View style={styles.toolbar}>
                        <Image style={styles.logo} source={require('./app_logo.png')}/>
                    </View>
                </ToolbarAndroid>
    }
    
});


var UnisportFeatured = React.createClass({

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
                    featuredProducts: responseData['products'].slice(0, 50)
                });
            })
            .done();
    },

    componentDidMount: function () {
        this.getFeaturedProducts()
    },

    render: function () {
        var navigator = this.props.navigator;

        var productNames = [];
        this.getFeaturedProducts();
        if (this.state.featuredProducts) {
            this.state.featuredProducts.forEach(function (element) {
                var name = element['name'];
                var image = element['image'];
                var price = element['price'];
                var currency = element['currency'];
                productNames.push(<ProductItem navigator={navigator} name={name} image={image} price={price} currency={currency}/>)
            });
        }

        return (
            <View style={styles.mainContainer}>
                <ToolbarUnisport />
                <ScrollView ref='scrollView' keyboardDismissMode='interactive'
                            style={styles.scrollView} contentContainerStyle={styles.content}>
                    {productNames}
                </ScrollView>
            </View>
        )
    }
});


class UnisportMobile extends React.Component{
  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={{id: 'featured_products'}}
        renderScene={this.navigatorRenderScene}/>
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id){
      case 'featured_products':
        return (<UnisportFeatured navigator={navigator}/>);
      case 'product_view':
        return (<ProductView navigator={navigator} name={route.product_name} 
                             image={route.product_image} price={route.product_price} currency={route.product_currency}/>);
    }
  }
}

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
    productImageLarge: {
        width: 300,
        height: 400,
        marginTop: 5,
        alignSelf: 'center'
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
    price:{
        width: 130,
        height: 110,
        color: '#08ac51',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    productTextLarge: {
        alignSelf: 'center',
        fontSize: 16,
        color: 'black'
    },
});

AppRegistry.registerComponent('UnisportMobile', () => UnisportMobile);
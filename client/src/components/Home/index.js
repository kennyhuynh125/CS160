import React, { Component } from 'react';
import { Container } from 'reactstrap';

/*
This component is the main page when the user goes on our site.
*/
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
            <Container style={{backgroundImage:'url(http://puu.sh/C0TmQ.png)', width:'100%',backgroundAttachment:'fixed',backgroundSize:'100%',padding:'0'}}>
                <div style={{height:'400px'}}/><div style={{textAlign:'justify',height:'1000',width:'100%',backgroundColor:'#fff'}}>
                <br/><h1>LetItFly</h1>
                LetItFly is a new service that allows you to book a ride to or from any Bay Area airport any time you
                want. This is just flavortext to make the site look less empty.

                <p/><h2>Getting Started</h2>
                <p/>Sign up or log into the website as a customer or driver. Once we make a how-to video for this project
                we could probably embed the video here or something to make this page fancier.

                <p/>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
                dolore magna aliqua. In nulla posuere sollicitudin aliquam. Sed viverra tellus in hac habitasse platea 
                dictumst. Commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit. Neque laoreet 
                suspendisse interdum consectetur libero id faucibus. Sodales ut etiam sit amet nisl purus in. Ultrices 
                dui sapien eget mi proin sed. Eu tincidunt tortor aliquam nulla facilisi cras. Enim sit amet venenatis 
                urna cursus eget nunc scelerisque viverra. Nullam eget felis eget nunc lobortis mattis. Vitae tempus 
                quam pellentesque nec nam aliquam sem et. Iaculis urna id volutpat lacus. At imperdiet dui accumsan sit 
                amet nulla facilisi morbi. Nibh praesent tristique magna sit amet purus gravida quis. Mi bibendum neque 
                egestas congue quisque egestas. Cras sed felis eget velit aliquet. Sed risus pretium quam vulputate 
                dignissim suspendisse. Porttitor rhoncus dolor purus non. Id porta nibh venenatis cras.

                <p/>Condimentum vitae sapien pellentesque habitant morbi tristique senectus et. Interdum posuere lorem 
                ipsum dolor sit amet. Id faucibus nisl tincidunt eget nullam. Dolor sit amet consectetur adipiscing 
                elit ut aliquam. Vivamus arcu felis bibendum ut. Et magnis dis parturient montes nascetur. Eget sit 
                amet tellus cras adipiscing enim eu. Amet luctus venenatis lectus magna fringilla urna. Facilisi etiam 
                ignissim diam quis enim lobortis scelerisque fermentum dui. Adipiscing enim eu turpis egestas pretium 
                aenean. Diam vulputate ut pharetra sit. Vitae congue eu consequat ac felis donec et odio pellentesque. 
                Ipsum nunc aliquet bibendum enim facilisis. Duis ultricies lacus sed turpis tincidunt. Ac turpis egestas 
                maecenas pharetra convallis posuere morbi leo. Adipiscing enim eu turpis egestas pretium aenean.

                <p/>Amet mattis vulputate enim nulla. Viverra aliquet eget sit amet tellus cras. Mauris ultrices eros 
                in cursus turpis massa tincidunt dui. Et molestie ac feugiat sed. Nibh sed pulvinar proin gravida. Sit 
                amet nisl suscipit adipiscing bibendum est ultricies. Libero justo laoreet sit amet cursus sit amet. 
                Ultrices tincidunt arcu non sodales neque sodales ut etiam sit. Vitae purus faucibus ornare suspendisse. 
                In egestas erat imperdiet sed euismod nisi porta. Risus at ultrices mi tempus imperdiet nulla malesuada. 
                Blandit cursus risus at ultrices mi tempus. Integer enim neque volutpat ac tincidunt vitae semper quis. 
                Tempus quam pellentesque nec nam aliquam sem. Phasellus vestibulum lorem sed risus.
                </div>
            </Container>
            </div>
        )
    }
}

export default Home;

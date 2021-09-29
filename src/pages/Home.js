import React from "react";
import {HomeSubMenu} from "../components/Home/HomeSubMenu";
import { NewArrival } from "../components/Home/NewArrival";
import Typewriter from "typewriter-effect";

const Home = () =>{
    return(
        <div>
            <HomeSubMenu />
            <div style={{backgroundColor:"#eee"}}>
                <div className="jumbotron">
                    <h1 className="display-4" style={{textAlign:"center"}}>
                    <Typewriter
                        options={{
                        strings: ['Welcome To ShopMe', 'Get the best product at discounted price', 'Your own Store'],
                        autoStart: true,
                        loop: true,
                    }}
                    />
                    </h1>
                </div>
                <NewArrival />
                <NewArrival />
            </div>
        </div>
    )
}
export default Home;
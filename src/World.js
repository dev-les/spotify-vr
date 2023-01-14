import React, {useState, useEffect} from 'react';
import 'aframe';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import block from './models/block.glb';
const track = {
  name: "",
  album: {
    images:[
      {url:""}
    ]
  },
  artist: [
    {name: ""}
  ]
}

function World(props) {
  const loader  = new GLTFLoader();

  loader.load(block, (d) =>{
    const entity = document.getElementById("block");
    entity.object3D.add(d.scene);
  })

  const [is_paused, setPaused] = useState(true);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);

  useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Spotify VR',
          getOAuthToken: cb => { cb(props.token)},
          volume: 0.5
        });
      
        setPlayer(player);

        player.addListener('ready', ({device_id}) =>{
          console.log('Ready with Device ID', device_id);
        });

        player.addListener('not_ready', ({device_id}) =>{
          console.log('Device ID has gone offline', device_id);
        });

        player.addListener('player_state_changed', ( state => {

            if(!state) {
              return;
            }

            setTrack(state.track_window.current_track);
            setPaused(state.paused);

            player.getCurrentState().then(state =>{
              (!state) ? setActive(false) : setActive(true)
            });
        }));

        player.connect();
        const play = document.querySelector('#play_button');
        const next = document.querySelector('#next_button');
        const prev = document.querySelector('#prev_button');

        play.addEventListener('click', () =>{
          player.togglePlay();
        });

        next.addEventListener('click', () =>{
          player.nextTrack();
        })

        prev.addEventListener('click', () =>{
          player.previousTrack();
        })
    };
  }, []);

  useEffect(() =>{
    const play = document.querySelector("#play_button");
    play.setAttribute('material', {src: is_paused ? "#play" : "#pause"});
  }, [is_paused]);

  let connected = () =>{
    if(current_track?.album?.images[0].url){
      return <a-image src={current_track.album.images[0].url} mixin="poster"/>
    }
    return <a-entity scale="4 4 1" position="0 0.2 0" text="value: Connect Device; align: center;"/>
  }

  

  return (
    <a-scene>
      <a-assets>
        <img id="glass" src={require('./assets/glass.png')}/>
        <img id="play" src={require('./assets/play.png')}/>
        <img id="pause" src={require('./assets/pause.png')}/>
        <img id="prev" src={require('./assets/prev.png')}/>
        <img id="next" src={require('./assets/next.png')}/>
        <img id="logo" src={require('./assets/spotify_icon.png')}/>
        <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg"/>
        <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg"/>

        <a-mixin
          id="frame"
          geometry="primitive: plane; width: 2.3; height:3"
          material="src:#glass; transparent:true"
        />
        <a-mixin
          id="button"
          geometry="primitive: plane; width: .5; height: .5"
          material="transparent:true"
          animation__scale="property: scale; to: 1.3 1.3 1.3; dur: 200; startEvents: mouseenter"
          animation__scale_reverse="property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave"
        />
        <a-mixin
          id="trackChange"
          geometry="primitive: plane; width: .3; height: .3"
          material="transparent:true"
          animation__scale="property: scale; to: 1.3 1.3 1.3; dur: 200; startEvents: mouseenter"
          animation__scale_reverse="property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave"
        />
        <a-mixin
          id="poster"
          geometry="primitive: plane; width: 1.55; height: 1.55"
          material="color: #FFFFFF; shader: flat"
          position="0 0.173 0.005"
        />

      </a-assets>

      <a-sky
        material="src: #skyTexture"
        rotation="0 0 0"
        height="2048"
        radius="30"
        theta-length="90"
        width="2048"/>
      <a-plane
        material="src: #groundTexture"
        rotation="-90 0 0"
        height="100"
        width="100"/>
      <a-entity id="block" 
        position="-.042 .595 -2.45"
        rotation="90 90 0" 
        scale=".14 .41 .16"/>

      {/* UI Start */}
      <a-entity id="ui" position="0 2.1 -2.5">
        <a-entity position="0 1.55 .049">
          <a-image src="#logo" scale=".4 .4 0"/>
        </a-entity>
        <a-entity id="music_frame" position="0 .281 .05" mixin="frame">
          {connected()}
        </a-entity>
        <a-entity id="play_button" material="src:#play" mixin="button" position="0 -.85 .052" />
        <a-entity id="next_button" material="src:#next" mixin="trackChange" position=".6 -.85 .052" />
        <a-entity id="prev_button" material="src:#prev" mixin="trackChange" position="-.6 -.85 .052" />
      </a-entity>

      <a-camera position="0 1.6 .8">
        <a-cursor></a-cursor>
      </a-camera>
    </a-scene>
  );
}
export default World
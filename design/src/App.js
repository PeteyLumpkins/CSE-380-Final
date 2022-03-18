import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1 id="campus-caverns-game-design-documentation">Campus Caverns Game Design Documentation</h1>
<p>A 2D top-down dungeon crawler game by Peter Walsh, Jeffery Tsang, Han Lin.</p>
<h2 id="introduction">Introduction</h2>
<h2 id="backstory">Backstory</h2>
<p>Deep beneath Stony Brooks Univeersity&#39;s West Campus, evil stirs. </p>
<p>Recently, Peter&#39;s friends have been mysteriously disappearing around the Old Computer Science buidling. One day, when Peter was leaving his office hours, he noticed a mysterious door he&#39;d never seen before. Upon further inspection, he found a stairwell that lead to the Old CS basement.</p>
<h2 id="objective">Objective</h2>
<p>Peter&#39;s goal is to explore the basement of the old computer science building and wherever it leads. As he goes along he&#39;s likely to encounter many foes, and potential hazards. After all, who knows whats been festering down there all these years. Armed with nothing but a whiffel-ball bat he stole from the SBCS storage room, Peter&#39;s on a mission to explore the basement of the old computer science building and rescue his friends.</p>
<h2 id="game-controls">Game Controls</h2>
<ul>
<li><strong>A</strong> - Move left</li>
<li><strong>S</strong> - Move down</li>
<li><strong>D</strong> - Move right</li>
<li><strong>W</strong> - Move Up</li>
<li><strong>SPACE</strong> - Attack</li>
<li><p><strong>ESC</strong> - Pauses the game and displays a small window with two options. </p>
<ol>
<li>Continue - unpauses the game</li>
<li>Main Menu - returns the player to the main menu</li>
<li>Help/Controls - displays a small popup with the game controls listed out</li>
</ol>
</li>
</ul>
<h2 id="graphical-user-interface">Graphical User Interface</h2>
<p>The graphical user interface for the screens will be as follows:</p>
<ul>
<li><p>Splash Screen - will just display the game&#39;s logo and game name, with a single button that say &quot;Start&quot;</p>
</li>
<li><p>Main Menu - the main menu will have the following visual elements</p>
<ol>
<li>A background image of the tunnels</li>
<li>A cavelike border around the edge of the screen</li>
<li>A &quot;Play&quot; button that loads the player into the first level of the game</li>
<li>A &quot;Controls&quot; button that loads the a page describing the controls to the player</li>
<li>A &quot;Levels&quot; button that will allow the player to select any level of the game they have unlocked to play</li>
<li>A &quot;Credits&quot; button that will display the credits for the game. Includes all of us (the devs) and McKenna the the TAs who worked on the game engine. Includes software used to develop the game.</li>
<li>A &quot;Story&quot; button that gives the player some backstory on the game and what it&#39;s about</li>
</ol>
</li>
</ul>
<h2 id="player-ui-hud">Player UI/HUD</h2>
<p>The in-game player heads up display will display the following items to the player:</p>
<ol>
<li>The Player&#39;s health (as a number). Visual health bar would be an added bonus</li>
<li>Number of each type of enemy killed. We only display the label if count &gt; 0. </li>
<li>Friends rescued. The number of Peter&#39;s friends he&#39;s found/rescued from tunnels.</li>
<li>The level that the player is on (as a number)</li>
</ol>
<p>More HUD items TBA. In general we probably want to keep the HUD as minimal as possible, to keep try and the experience as immersive as possible.</p>
<h2 id="artwork">Artwork</h2>
<p>All artwork for the game is going to have to be original. We need to create/develop the following:</p>
<h3 id="sprites">Sprites</h3>
<ul>
<li><p>Peter - our main character/protagonist. He&#39;s going to be a simple animated sprite (size TBA) with the following animations:</p>
<ol>
<li>Walking left</li>
<li>Walking right</li>
<li>Walking up</li>
<li>Walking down</li>
<li>Attacking left</li>
<li>Attacking right</li>
<li>Attacking up</li>
<li>Attacking down</li>
<li>Taking damage</li>
<li>Dying</li>
</ol>
</li>
<li><p>Rat - one of the critters crawling around in the tunnels. Also an animated sprite (size TBA):</p>
<ol>
<li>Walking left</li>
<li>Walking right</li>
<li>Walking up</li>
<li>Walking down</li>
<li>Attacking left</li>
<li>Attacking right</li>
<li>Attacking up</li>
<li>Attacking down</li>
<li>Taking damage</li>
<li>Dying</li>
</ol>
</li>
<li><p>Monkey - a few of the monkeys that were in Old CS in the early 2000s escaped into the tunnels. Also an animated sprite (size TBA) with the following animations:</p>
<ol>
<li>Walking left</li>
<li>Walking right</li>
<li>Walking up</li>
<li>Walking down</li>
<li>Attacking left</li>
<li>Attacking right</li>
<li>Attacking up</li>
<li>Attacking down</li>
<li>Taking damage</li>
<li>Dying</li>
</ol>
</li>
</ul>
<h3 id="tiles-and-tilesets">Tiles and Tilesets</h3>
<p>The game will have approximately six levels. Each level will have it&#39;s own unique tileset and tiles.</p>
<h4 id="tilesets">Tilesets</h4>
<p>Each level will in the game will have it&#39;s own tileset that conforms (generally) to the themes of the game levels which are as follows:</p>
<ol>
<li><strong>Old CS Basement</strong>. Just concrete, pipes and mold.</li>
<li>3.</li>
<li><strong>Library Basement</strong>. Old books/bookshelves and cobwebs. Wooden theme?
5.</li>
<li><strong>Jatvits Lecture Basement/Bunker</strong>. Some kind of fallout shelter or secret nuclear bunker. Maybe very modern theme?</li>
</ol>
<h4 id="tiles">Tiles</h4>
<p>There will be one tileset per level in the game. Besides conforming to the theme of the level, each tileset should have the following tiles:</p>
<ul>
<li>Floor Tile - the basic floor tile of the level. Should have a little bit of an outline.</li>
<li>Wall tiles - should fit the theme of the room. More details TBA.</li>
<li>Outline tiles - clearly define the playable space that the player can play in. Because the levels will attempt to simulate a 3D box of sorts, we want clear boundries indicated to the player. These will be the same for every tileset.</li>
</ul>
<h2 id="sound-effects">Sound Effects</h2>
<p>TBA</p>
<h2 id="gamee-music">Gamee Music</h2>
<p>TBA</p>
    </div>
  );
}

export default App;

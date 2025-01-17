import { useRef, useState , useEffect , useCallback} from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import {sortPlacesByDistance} from './loc.js'

const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedIds.map((id) => 
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen , setModalIsOpen] = useState(false) ;
  const [ availablePlaces, setAvailablePlaces ] = useState([])
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);


  /* 
    React's function components manage 'side effects' using the 'useEffect' hook.
    the idea behind useEffect() is that the function we passed as the first argument to useEffect will be executed by react **after** every component execution if we didn't define dependencies array 
    useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => 
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES , 
        position.coords.latitude , 
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    }) 
  } );

  but if defined dependencies array than react will actually take a look at the dependencies specifies there and the first argument function will execute only if the dependencies value changes  
  */
  useEffect(() => {
    /*navigator is a object exposed by the browser (not by js or react) to our js code. So navigator is not defined by us or by react , it's provided by the browser instead */
    navigator.geolocation.getCurrentPosition((position) => { /*browser exposes the fetch position to us through a 'position' object which it automatically passes to the call back function. we used a call back function because fetching user's location can take some time */
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES , 
        position.coords.latitude , 
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    }) 
  } , []);
  

  function handleStartRemovePlace(id) {
    setModalIsOpen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if (storedIds.indexOf(id) === -1){
      localStorage.setItem('selectedPlaces' , JSON.stringify([id , ...storedIds]))  // just like navigator , is provided by the browser , not by react or JS . And .setItem() method is used to store data in the browser's storage and that data will also be available is we leave the website and comeback later or we reload the website 
    //                      .setItem is easy to use . first argument is identifier (passed in string) and as second argument we pass the value that should be stored . 
    //                       here 'selectedPlaces' acts as a key
    //                      IMPORTANT => the data we are storing must be in string format (can't store an array or object) .
    //                                   ***the data must be converted in string*** using JSON.stringify() method also provided by the browser.
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
   setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem('selectedPlaces' , JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current)))
  }, [])

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText='Sorting places by distance...'
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;

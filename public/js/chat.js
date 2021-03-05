let socket = io();

// ELEMENTS
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $geolocateButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages')

// templates
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $loactionMessageTemplate = document.querySelector('#location-message-template').innerHTML;

//query
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})

socket.on('send', (message) => {
    console.log(message);
    let html = Mustache.render($messageTemplate, {
        message:message.text,
        CreatedAt:moment(message.CreatedAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (message)=>{
    console.log(message);
    let html = Mustache.render($loactionMessageTemplate, {
        url:message.url,
        CreatedAt:moment(message.CreatedAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // const mess = document.querySelector('input').value;
    let mess = e.target.elements.message.value;
    $messageFormButton.setAttribute('disabled', 'disabled')
    socket.emit('sendMessage', mess, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }
        console.log('message delivered!');
    });
})


$geolocateButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported in your browser');
    }

    $geolocateButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $geolocateButton.removeAttribute('disabled')
            console.log('location shared!');
        });
    })
})

socket.emit('join', {username, room});

// socket.on('countUpdate', (count)=>{
//     console.log("client side connected", count);
// })

// document.getElementById('increment').addEventListener('click', (e)=>{
// e.preventDefault();

// socket.emit('increment');
// })



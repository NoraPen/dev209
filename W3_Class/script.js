let fooElem = document.getElementById('firstLi')
//getElementsByClassName or Id or TagName to get element in oder to change it

//debugger; //stops on debugger line in dev tools to see before and after on page


fooElem.textContent='modified'//textContent = text content of elem, read as plain text not html
//modifys the element on page


//Event Listener
function onClickCallback(){
    alert("You clicked me!");//add pop up
}
fooElem.addEventListener('click', onClickCallback);
//put event listen on cards then add function to change || book 12.3


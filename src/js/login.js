const xhr = new XMLHttpRequest()

// xhr.open('GET', 'https://www.duitang.com/napi/vienna/feed/list/by_common/?start=0&limit=18')
xhr.open('GET', '/dt?start=0&limit=18')

xhr.send()

xhr.onload = function(){
    console.log(JSON.parse(xhr.responseText))
}
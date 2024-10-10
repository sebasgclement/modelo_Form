//Instalar Node.JS
//https://www.npmjs.com/package/json-server?activeTab=readme
//Instalar JSON-server
//crear archivo db.JSON

const d = document,
    $form = d.getElementById('form-task'),
    $list = d.getElementById('list'),
    $template = d.getElementById('template-task').content,
    $titleForm = d.getElementById('title-form'),
    $frag = d.createDocumentFragment();

const getData = async () => {
    try {
        let res = await fetch('http://localhost:3000/tasks'),
            json = await res.json();
            console.log(json)
            if (!res.ok) throw {statusText : res.statusText, status: res.status}
            json.forEach(element =>{
                $template.querySelector('h3').textContent = element.title;
                $template.querySelector('p').textContent = element.message;
                $template.querySelector('#edit').dataset.id = element.id;
                $template.querySelector('#edit').dataset.title = element.title;
                $template.querySelector('#edit').dataset.message = element.message;
                $template.querySelector('#delete').dataset.id = element.id;
                let $clone = d.importNode($template, true);
                $frag.appendChild($clone);
            });
            $list.appendChild($frag);

    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $list.innerHTML = `<h3 class="error">${err.status} : ${err.message}</h3>`;
    }
}

const save = async(titleForm, messageForm) => {
    try {
        let res = await fetch ('http://localhost:3000/tasks');
        let json = await res.json();

        let lastId = json.length > 0 ? Math.max(...json.map(task => parseInt(task.id))): 0;
        let newId = lastId + 1;

        let option = {
            method: "POST",
            header : {
                "Content-type" : "application/json; charset=utf-8"
            },

            body : JSON.stringify({
                id : newId.toString(),
                title: titleForm,
                message: messageForm
            })
        }

        res = await fetch('http://localhost:3000/tasks', option);
        if (!res.ok) throw {statusText : res.statusText, status: res.status}
        location.reload();

    } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $list.innerHTML = `<h3 class="error">${err.status} : ${err.message}</h3>`;
    }
}

d.addEventListener('DOMContentLoaded', getData());
d.addEventListener('submit', (e) =>{
    if(e.target === $form){
        e.preventDefault();
        //console.log('Probando submit');
        if(!e.target.id.value) save(e.target.title.value, e.target.message.value);
        //else
    }
})



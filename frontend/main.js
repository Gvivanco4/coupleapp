
const container = document.querySelector('.create');
// const postButton = document.querySelector('.add');
const body = document.querySelector('body')

const createForm = (formID, memorieID = null) => {
    const formEle = document.createElement('form');
    const submitButton = document.createElement('button');

    
    formEle.id = formID
    inputNames = ['titulo', 'descripcion', 'url'];
    
    inputNames.map((t) => {
        const containerInput = document.createElement('div')
        const label = document.createElement('label');
        const input = document.createElement('input');
        const textArea = document.createElement('textarea')

        if (t === 'descripcion') {
            label.htmlFor = `${t}`;
            label.textContent = `${t.charAt(0).toUpperCase() + t.slice(1)}`;
            label.style.display = "none";
            textArea.type = 'text';
            textArea.id = `${t}`;
            textArea.name = `${t}`;
            containerInput.id = `${t}-id`;
            containerInput.append(label, textArea)
        } else {
            label.htmlFor = `${t}`;
            label.textContent = `${t.charAt(0).toUpperCase() + t.slice(1)}`;
            label.style.display = "none";
            input.type = 'text';
            input.id = `${t}`;
            input.name = `${t}`;
            containerInput.id = `${t}-id`;
            containerInput.append(label, input)
        }
        formEle.append(containerInput);
        }
    )

   
    const moodContainerInput = document.createElement('div')
    const imageContainerInput = document.createElement('div')
    const moodLabel = document.createElement('label');
    const moodInput = document.createElement('input');
    const imageLabel = document.createElement('label');
    const imageInput = document.createElement('input');

    imageLabel.htmlFor = 'image';
    imageLabel.textContent = 'Image';
    imageContainerInput.id = 'image-id'

    imageInput.type = 'file'
    imageInput.id = 'image';
    imageInput.name = 'image'
    imageInput.accept = 'image/jpeg, image/png, image/jpg'

    moodLabel.htmlFor = 'mood';
    moodLabel.textContent = 'Mood';

    moodContainerInput.id = 'mood-id'
    moodInput.type = 'range';
    moodInput.required = true;
    moodInput.min = '0';
    moodInput.max = '10';
    moodInput.value = '5';
    moodInput.step = '2';
    moodInput.id = "mood";
    moodInput.name = 'mood';

    submitButton.type = 'submit';
    submitButton.className = 'submit'
    submitButton.textContent = 'Submit';

    moodContainerInput.append(moodLabel, moodInput)
    imageContainerInput.append(imageLabel, imageInput)
    formEle.append(moodContainerInput, imageContainerInput, submitButton);
    
    container.append(formEle);

    const titleInput = document.querySelector('[name="titulo"]')
    const descriptionInput = document.querySelector('[name="descripcion"]')
    const urlInput = document.querySelector('[name="url"]')
    urlInput.type = 'url'
    titleInput.required = true
    titleInput.minLength = '4'
    titleInput.maxLength = '20'
    titleInput.placeholder = 'Ingresa el título de la memoria'
    descriptionInput.required = true
    descriptionInput.placeholder = 'Escribe la descripción de la memoria'

    formEle.addEventListener('submit', async (e) => {
        const cardsEle = document.querySelector('.cards')
        if (formEle.id === 'post') {
        e.preventDefault();
        const formData = handleSubmit(e);
        console.log(...formData.entries());
        
        const urlValue = formData.get('url')
        const imageValue = formData.get('image').name
        console.log(`URL: ${urlValue} IMAGE:${imageValue.name}`)

        if (urlValue === '' && imageValue === '') {
           const newDiv = document.createElement('div')
           newDiv.textContent = 'Invalido'
           body.append(newDiv)
        }

        await postData(formData);
    } else if (formEle.id === 'edit') {
        e.preventDefault();
        const formData = handleSubmit(e);
        console.log(...formData.entries());
        
        const urlValue = formData.get('url')
        const imageValue = formData.get('image').name
        console.log(`URL: ${urlValue} IMAGE:${imageValue.name}`)

        if (urlValue === '' && imageValue === '') {
           const newDiv = document.createElement('div')
           newDiv.textContent = 'Invalido'
           body.append(newDiv)
        }

        await updateMemorie(formData, memorieID);
    }
    
    cardsEle.innerHTML = ""
    renderList()
        
        // Eliminar datos del form para volverlo a llenar de nuevo

        // Añadir elemento para notificar que se posteo correctamente


    }, { once: true }
)
    //Validations

        //Title

        titleInput.addEventListener('input', (e) => {
            
            titleInput.setCustomValidity('')
            
            if (titleInput.validity.valid) {
                titleInput.setCustomValidity('')
            } else {
                titleInput.setCustomValidity(`El título debe contener min. ${titleInput.minLength} y máx. ${titleInput.maxLength} caracteres`)
            }
        })

        titleInput.addEventListener('invalid', (e) => {
            
            titleInput.setCustomValidity('')
            
            if (titleInput.validity.valueMissing){
                titleInput.setCustomValidity('La memoria necesita un título')
            } else {
                titleInput.setCustomValidity(`El título debe contener min. ${titleInput.minLength} y máx. ${titleInput.maxLength} caracteres`)
            }
        })

        


        //URL

        urlInput.addEventListener('input', (e) => {
            if (urlInput.validity.typeMismatch) {
                urlInput.setCustomValidity("Ingresa una URL valida Nanei")
            
            } else {
                urlInput.setCustomValidity('')
            }
        })

        //Descripción

        descriptionInput.addEventListener('input', (e) => {
            descriptionInput.setCustomValidity('')

            if (descriptionInput.validity.valid) {
                descriptionInput.setCustomValidity('')
            } else if (descriptionInput.validity.valueMissing) {
                descriptionInput.setCustomValidity('La descripción no puede estar vacía')
            } else {
                descriptionInputInput.setCustomValidity(`La descripción debe contener min. ${descriptionInput.minLength} y máx. ${descriptionInput.maxLength} caracteres`)
            }
        })

        descriptionInput.addEventListener('invalid', (e) => {
            descriptionInput.setCustomValidity('')

            if (descriptionInput.validity.valueMissing) {
                descriptionInput.setCustomValidity('La descripción no puede estar vacía')
            } else {
                descriptionInput.setCustomValidity(`La descripción debe contener min. ${descriptionInput.minLength} y máx. ${descriptionInput.maxLength} caracteres`)
            }
        })

        //Mood

        moodInput.addEventListener('input', (e) => {
           moodInput.setCustomValidity('')

            if (moodInput.validity.valid) {
                moodInput.setCustomValidity('')
            } else if (moodInput.validity.valueMissing) {
                moodInput.setCustomValidity('La descripción no puede estar vacía')
            } else {
                moodInput.setCustomValidity(`La descripción debe contener min. ${descriptionInput.minLength} y máx. ${descriptionInput.maxLength} caracteres`)
            }
        })


        //File

        imageInput.addEventListener('change', (e) => {
            const validImage = e.target.files[0].name.endsWith('.jpg') || e.target.files[0].name.endsWith('.png')
    
             if (!validImage) {
                imageInput.setCustomValidity("Seleccioniste archivo incorrecto")
                imageInput.reportValidity()
             } else {
                console.log("OK")
             }
             
        })
}


// Event Listener

// postButton.addEventListener("click", (e) => {
//     e.preventDefault()
//     const formIdentification = 'post'
//     createForm(formIdentification)
// }, { once: true})

createForm('post')

//Handle

const handleSubmit = (e) => {
    return new FormData(e.target);
}

const handleDelete = async (id) => {
    await deleteMemorie(id)

}

// Post Metod

const postData = async (formData) => {
     try {
    const response = await fetch("http://127.0.0.1:8000/memorie", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    console.log(result);

  } catch (err) {
    console.error(err);
  }

}

const deleteMemorie = async (id) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/memorie/${id}`, {
            method: 'DELETE'
        })
        const result = await response.json();
        console.log(result)
    } catch (err) {
        console.log(err)
    }
}


const updateMemorie = async (formData, id) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/memorie/${id}`, {
            method: 'PUT',
            body: formData
        })
        const result = await response.json();
        console.log(result)
    } catch (err) {
        console.log(err)
    }
}

const getData = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/memories")

        const result = await response.json();
        console.log(result)
        return result
    } catch (err) {
        console.log(err)
    }

    
}
// Card Component

function cardComponent (memorie, parentDiv) {
    const parentCardContainer = document.createElement('div')
    const container = document.createElement('div')
    const titleDiv = document.createElement('h1')
    const descriptionDiv = document.createElement('p')
    const graphicContentDiv = document.createElement('div')
    const imageEle = document.createElement('img')
    const urlDiv = document.createElement('div')
    const deleteButton = document.createElement('button')
    const editButton = document.createElement('button')

    // Class names for styling

    container.className = "card"
    titleDiv.className = "title-card"
    descriptionDiv.className = "description-card"
    imageEle.className = "image-card"
    urlDiv.className = "url-card"
    parentDiv.className = "cards"
    graphicContentDiv.className = "graphic-card"
    deleteButton.className = "dlt-btn"
    editButton.className = "edit-btn"

    // Do stuff

    titleDiv.textContent = memorie.titulo
    descriptionDiv.textContent = memorie.descripcion

    memorie.image_url ?  imageEle.src = memorie.image_url : ""
    memorie.url ? urlDiv.textContent = memorie.url : ""


    // Append
    graphicContentDiv.append(imageEle, urlDiv)
    container.append(titleDiv, descriptionDiv, graphicContentDiv, editButton, deleteButton)
    parentDiv.append(container)

    //Event Listeners Buttons

    deleteButton.addEventListener('click', async (e) => {
        const dlt = await handleDelete(memorie.id)
    })

    editButton.addEventListener('click', (e) => {
        const editForm = 'edit'
        createForm(editForm, memorie.id)
    })
}

    // Render Lists

    const renderList = async () => {
        
        const listContainer = document.createElement('div')
        const memorieList = await getData()

        memorieList.map((m) => {
            cardComponent(m, listContainer)
        })

        body.append(listContainer)
    }

    renderList()

    // Add NOTIFICATIONS WHEN SUBMITTED, DELETED, EDITED, UPDATED.
    // ERRORS POP UPS







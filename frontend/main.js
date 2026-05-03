
const container = document.querySelector('.create');
// const postButton = document.querySelector('.add');
const body = document.querySelector('body')
const modal = document.createElement('dialog')
    modal.id = 'modal'
    const textModal = document.createElement('p')
    textModal.id = 'textModal'
    const iconModal = document.createElement('span')
    iconModal.className = 'material-symbols-outlined'
    const closeBtn = document.createElement('button')
    closeBtn.id = 'closeModal'
    closeBtn.textContent = 'OK'

    modal.append(iconModal, textModal, closeBtn)
    body.append(modal)

const createForm = (formID, memorieID = null) => {
    const formEle = document.createElement('form');
    const submitButton = document.createElement('button');
    const textInputBox = document.createElement('div')

    formEle.id = formID
    const inputNames = ['titulo', 'descripcion'];
    
    inputNames.map((t) => {
        const containerInput = document.createElement('div')
        const label = document.createElement('label');
        const input = document.createElement('input');
        const textArea = document.createElement('textarea')

        if (t === 'descripcion') {
            label.htmlFor = `${formID}-${t}`;
            label.textContent = `${t.charAt(0).toUpperCase() + t.slice(1)}`;
            label.style.display = "none";
            textArea.type = 'text';
            textArea.id = `${formID}-${t}`;
            textArea.name = `${t}`;
            containerInput.id = `${t}-id`;
            containerInput.append(label, textArea)
        } else {
            label.htmlFor = `${formID}-${t}`;
            label.textContent = `${t.charAt(0).toUpperCase() + t.slice(1)}`;
            label.style.display = "none";
            input.type = 'text';
            input.id = `${formID}-${t}`;
            input.name = `${t}`;
            containerInput.id = `${t}-id`;
            containerInput.append(label, input)
        }
        
        formEle.append(containerInput);
        }
    )

   
    const moodContainerInput = document.createElement('div')
    const imageContainerInput = document.createElement('div')
    // const urlContainerInput = document.createElement('div')
    const moodLabel = document.createElement('label');
    const moodInput = document.createElement('input');
    const imageLabel = document.createElement('label');
    const imageInput = document.createElement('input');
    const imageStatus = document.createElement('p');
    // const urlLabel = document.createElement('label');
    // const urlInput = document.createElement('input');

    const imageIcon = document.createElement('span')

    imageLabel.htmlFor = 'image';
    imageContainerInput.id = 'image-id'
    imageIcon.className = 'material-symbols-outlined'
    imageIcon.textContent = 'image'

    imageLabel.append(imageIcon)

    imageInput.type = 'file'
    imageInput.id = 'image';
    imageInput.name = 'image'
    imageInput.accept = 'image/jpeg, image/png, image/jpg'
    imageStatus.className = 'file-status'
    imageStatus.textContent = 'No hay archivo seleccionado'

    const moodIcon = document.createElement('span')

    moodIcon.className = 'material-symbols-outlined'
    moodIcon.textContent = 'mood'

    moodLabel.htmlFor = 'mood';
    moodLabel.append(moodIcon)

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

    // urlLabel.htmlFor = `input`;
    // urlLabel.textContent = `Input`;
    // urlLabel.style.display = "none";
    // urlInput.type = 'url';
    // urlInput.id = `input`;
    // urlInput.name = `Input`;
    // urlContainerInput.id = `url-id`;
    // urlContainerInput.append(urlLabel, urlInput)
    const moodPlaceholder = document.createElement('p')
    moodPlaceholder.textContent = 'Mood de la memoria'

    const contentGraphBox = document.createElement('div')
    contentGraphBox.id = 'content-box'

    moodContainerInput.append(moodLabel, moodInput, moodPlaceholder)
    imageContainerInput.append(imageLabel, imageInput, imageStatus)
    contentGraphBox.append(imageContainerInput, moodContainerInput)
    
    formEle.append(contentGraphBox, submitButton);
    
    container.append(formEle);
    let isSubmitting = false

    const titleInput = formEle.querySelector('[name="titulo"]')
    const descriptionInput = formEle.querySelector('[name="descripcion"]')
    titleInput.required = true
    titleInput.minLength = 4
    titleInput.maxLength = 20
    titleInput.placeholder = 'Ingresa el título de la memoria'
    descriptionInput.required = true
    descriptionInput.placeholder = 'Escribe la descripción de la memoria o ingresa un URL de Youtube'

    if (formID === 'edit') {
        console.log(memorieID)
        titleInput.value = memorieID.titulo
        descriptionInput.value = memorieID.descripcion
        moodInput.value = memorieID.mood
    }

    const emptyColor = "#DDDDDD";

    moodInput.addEventListener('input', (e) => {
        const input = e.target
        const value = Number(input.value);
        
        const percent = ((value - input.min) / (input.max - input.min)) * 100 + "%";
        let fillColor;

        if (value < 5) {
            fillColor = "#D32F2F"; // rojo
            moodIcon.textContent = 'mood_bad'
        } else if (value > 6) {
            fillColor = "#2E7D32"; // verde
            moodIcon.textContent = 'mood'
        } else {
            fillColor = "#1976D2"; // azul neutro
            moodIcon.textContent = 'sentiment_content'
        }

        input.style.background = `linear-gradient(
            to right,
            ${fillColor} 0%,
            ${fillColor} ${percent},
            ${emptyColor} ${percent},
            ${emptyColor} 100%
            )`;
        
    })

    imageInput.addEventListener('change', (e) => {
        const selectedFile = e.target.files[0]
        imageStatus.textContent = selectedFile ? selectedFile.name : 'No file chosen'
        imageStatus.style = selectedFile ? 'color: green;' : null
        
    })

    formEle.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (!formEle.reportValidity()) {
            return;
        }

        isSubmitting = true
        submitButton.disabled = true

        const cardsEle = document.querySelector('.cards')
        
        try {
            if (formEle.id === 'post') {
                const formData = handleSubmit(e);
                console.log(...formData.entries());
                modal.showModal()

                iconModal.textContent = 'cycle'
                iconModal.className = 'material-symbols-outlined loading'
                textModal.textContent = 'Subiendo memoria, espera un momento Nanei'
                closeBtn.hidden = true

                try {
                    await postData(formData);
                    
                        iconModal.textContent = 'check'
                        iconModal.className = 'material-symbols-outlined success'
                        textModal.textContent = 'Memoria subida con éxito'
                        closeBtn.hidden = false
                  
                } catch (e) {
                    iconModal.textContent = 'error'
                    iconModal.className = 'material-symbols-outlined error'
                    textModal.textContent = 'Error Nanei, intentalo de nuevo'
                    closeBtn.hidden = false
                }

                closeBtn.addEventListener('click', () => {
                    modal.close()
                    console.log('creado 1')
                })

                formEle.reset()
            } else if (formEle.id === 'edit') {
                const formData = handleSubmit(e);
                console.log(...formData.entries());
                modal.showModal()

                iconModal.textContent = 'cycle'
                iconModal.className = 'material-symbols-outlined loading'
                textModal.textContent = 'Actualizando memoria, espera un momento Nanei'
                closeBtn.hidden = true

                try {
                    await updateMemorie(formData, memorieID.id);
                    
                        iconModal.textContent = 'check'
                        iconModal.className = 'material-symbols-outlined success'
                        textModal.textContent = 'Memoria actualizada con éxito'
                        closeBtn.hidden = false
                    
                } catch (err) {
                    iconModal.textContent = 'error'
                    iconModal.className = 'material-symbols-outlined error'
                    textModal.textContent = 'Error Nanei, intentalo de nuevo'
                    closeBtn.hidden = false
                }

                closeBtn.addEventListener('click', () => {
                    modal.close()
                })

                formEle.reset()
            }

            if (cardsEle) {
                cardsEle.innerHTML = ""
            }
            
            renderList()
        } finally {
            isSubmitting = false
            submitButton.disabled = false
        }


    })
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

        


        // //URL

        // urlInput.addEventListener('input', (e) => {
        //     if (urlInput.validity.typeMismatch) {
        //         urlInput.setCustomValidity("Ingresa una URL valida Nanei")
            
        //     } else {
        //         urlInput.setCustomValidity('')
        //     }
        // })

        //Descripción

        descriptionInput.addEventListener('input', (e) => {
            descriptionInput.setCustomValidity('')

            if (descriptionInput.validity.valid) {
                descriptionInput.setCustomValidity('')
            } else if (descriptionInput.validity.valueMissing) {
                descriptionInput.setCustomValidity('La descripción no puede estar vacía')
            } else {
                descriptionInput.setCustomValidity(`La descripción debe contener min. ${descriptionInput.minLength} y máx. ${descriptionInput.maxLength} caracteres`)
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
            const selectedFile = e.target.files[0]

            if (!selectedFile) {
                imageInput.setCustomValidity('')
                return
            }

            const validImage = selectedFile.name.endsWith('.jpg') || selectedFile.name.endsWith('.png') || selectedFile.name.endsWith('.jpeg')
    
             if (!validImage) {
                imageInput.setCustomValidity("Seleccioniste archivo incorrecto")
                imageInput.reportValidity()
                imageInput.style = 'color: red;'
             } else {
                imageInput.setCustomValidity('')
                imageInput.style = 'color: green;'
             }
             
        })

        //Descripction Youtube Video

        descriptionInput.addEventListener('input', (e) => {
            const youtubePattern = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
            const value = e.target.value
            const isYoutubeUrl = youtubePattern.test(value)
            const youtubeUrl = value.match(youtubePattern)
            imageContainerInput.style.display = 'flex'

            if (isYoutubeUrl) {
                youtubeVideo(youtubeUrl, contentGraphBox)
                imageContainerInput.style.display = 'none'
            } 

        })

        return formEle
}


// Event Listener

// postButton.addEventListener("click", (e) => {
//     e.preventDefault()
//     const formIdentification = 'post'
//     createForm(formIdentification)
// }, { once: true})

const postFo = createForm('post')

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

    if (!response.ok) {
      throw new Error(`POST /memorie failed with status ${response.status}`);
    }

    const result = await response.json();
    
    console.log(result);
    return result;

  } catch (err) {
    console.error(err);
    throw err;
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
        return result
    } catch (err) {
        console.log(err)
        throw err
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
    const cardsContainer = document.querySelector('.cards')
    const titleDiv = document.createElement('h1')
    const descriptionDiv = document.createElement('p')
    const graphicContentDiv = document.createElement('div')
    const imageEle = document.createElement('img')
    // const urlDiv = document.createElement('div')
    const deleteButton = document.createElement('button')
    const editButton = document.createElement('button')
    const mainContainer = document.querySelector('.main-container')
    const buttonDiv = document.createElement('div')
    const moodEle = document.createElement('div')
    const moodIcon = document.createElement('span')
    const moodText = document.createElement('p')
    const textDiv = document.createElement('div')

    if (cardsContainer) {
        cardsContainer.remove()
    }

    // Class names for styling
        moodIcon.className = 'material-symbols-outlined'
        moodIcon.textContent = 'mood'
        container.className = "card"
        titleDiv.className = "title-card"
        descriptionDiv.className = "description-card"
        buttonDiv.className = 'buttons'
        imageEle.className = "image-card"
        // urlDiv.className = "url-card"
        parentDiv.className = "cards"
        graphicContentDiv.className = "graphic-card"
        deleteButton.className = "dlt-btn"
        editButton.className = "edit-btn"
        moodEle.className = 'mood-card'
        textDiv.className = 'text-card'

        editButton.textContent = 'Editar'
    deleteButton.textContent = 'Eliminar'
    titleDiv.textContent = memorie.titulo
    descriptionDiv.textContent = memorie.descripcion

    memorie.image_url ?  imageEle.src = memorie.image_url : ""


    moodText.textContent = 'Me siento..'
    if (memorie.mood > 7) {
        moodIcon.textContent = 'mood'
    } else if (memorie.mood < 5) {
        moodIcon.textContent = 'mood_bad'
    } else {
        moodIcon.textContent = 'sentiment_content'
    }

    const youtubePattern = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const value = memorie.descripcion
    const isYoutubeUrl = youtubePattern.test(value)
    const youtubeUrl = value.match(youtubePattern)

    if (!memorie.image_url || isYoutubeUrl) {

           // Append
        textDiv.append(titleDiv, descriptionDiv)
        moodEle.append(moodText, moodIcon)
        buttonDiv.append(editButton, deleteButton)

        if (isYoutubeUrl) {
            youtubeVideo(youtubeUrl, graphicContentDiv, 'card')
            graphicContentDiv.append(moodEle)
        } else {
            graphicContentDiv.append(moodEle)
        } 

        container.append(textDiv, graphicContentDiv, buttonDiv)
        parentDiv.append(container)
    } else {
        

    // Append
        textDiv.append(titleDiv, descriptionDiv)
        moodEle.append(moodText, moodIcon)
        buttonDiv.append(editButton, deleteButton)
        graphicContentDiv.append(imageEle, moodEle)
        container.append(textDiv, graphicContentDiv, buttonDiv)
        parentDiv.append(container)
    }
    


    // Do stuff
    
    //Event Listeners Buttons

    deleteButton.addEventListener('click', async (e) => {
        e.preventDefault()
        const cardsEle = document.querySelector('.cards')

        

        modal.showModal()

        iconModal.textContent = 'cycle'
        iconModal.className = 'material-symbols-outlined loading'
        textModal.textContent = 'Eliminando memoria, espera un momento Nanei'
        closeBtn.hidden = true

        try {
            
            await handleDelete(memorie.id)
            
                 iconModal.textContent = 'check'
                iconModal.className = 'material-symbols-outlined success'
                textModal.textContent = 'Memoria eliminada con éxito'
                closeBtn.hidden = false
           
        } catch (e) {
                iconModal.textContent = 'error'
                iconModal.className = 'material-symbols-outlined error'
                textModal.textContent = 'Error Nanei, intentalo de nuevo'
                closeBtn.hidden = false
        }

        closeBtn.addEventListener('click', () => {
            modal.close()
        })

        if (cardsEle) {
            cardsEle.innerHTML = ''
        }

        renderList()

        
    })

    editButton.addEventListener('click', (e) => {
        const editForm = 'edit'
        console.log(postFo)
        postFo.style.display = 'none'
        const editFo = createForm(editForm, memorie)
        console.log(editFo)

        editFo.addEventListener('submit', (e) => {
        editFo.reset()
        editFo.remove()
        postFo.style.display = 'flex'
    })
    }, {once: true})

    


    
}

    // Render Lists

    const renderList = async () => {

         const mainContainer = document.querySelector('.main-container')
        const listContainer = document.createElement('div')
        
        const memorieList = await getData()

        memorieList.map((m) => {
            cardComponent(m, listContainer)
        })

        mainContainer.append(listContainer)
    }

    renderList()

    // Add NOTIFICATIONS WHEN SUBMITTED, DELETED, EDITED, UPDATED.
    // ERRORS POP UPS

    // Youtube Embed

    const youtubeVideo = (urlVideo, descriptionInput, type='form') => {
        const iFrame = document.createElement('iframe')
        const idBox = document.createElement('div')

        if (type === 'form') {
            idBox.id = 'youtube-video'
            iFrame.className = 'youtube'
            const id = urlVideo.slice(-11)[1]
            iFrame.setAttribute('src', `https://www.youtube.com/embed/${id}`)
            idBox.append(iFrame)
            descriptionInput.append(idBox)
        } else {
            iFrame.className = 'youtube-card'
            const id = urlVideo.slice(-11)[1]
            iFrame.setAttribute('src', `https://www.youtube.com/embed/${id}`)
            descriptionInput.append(iFrame)
        }
        
    }





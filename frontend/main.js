
const container = document.querySelector('.create');
const postButton = document.querySelector('.add');

const createForm = () => {
    const formEle = document.createElement('form');
    const submitButton = document.createElement('button');
    
    inputNames = ['titulo', 'descripcion', 'url'];
    
    inputNames.map((t) => {
        const label = document.createElement('label');
        const input = document.createElement('input');

        label.htmlFor = `${t}`;
        label.textContent = `${t.charAt(0).toUpperCase() + t.slice(1)}`;

        input.type = 'text';
        input.id = `${t}`;
        input.name = `${t}`;

        formEle.append(label, input);
        }
    )

   

    const moodLabel = document.createElement('label');
    const moodInput = document.createElement('input');
    const imageLabel = document.createElement('label');
    const imageInput = document.createElement('input');

    imageLabel.htmlFor = 'image';
    imageLabel.textContent = 'Image';

    imageInput.type = 'file'
    imageInput.id = 'image';
    imageInput.name = 'image'
    imageInput.accept = 'image/jpeg, image/png, image/jpg'

    moodLabel.htmlFor = 'mood';
    moodLabel.textContent = 'Mood';

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

    formEle.append(moodLabel, moodInput, imageLabel, imageInput, submitButton);
    
    container.append(formEle);

    const titleInput = document.querySelector('[name="titulo"]')
    const descriptionInput = document.querySelector('[name="descripcion"]')
    const urlInput = document.querySelector('[name="url"]')
    urlInput.type = 'url'
    titleInput.required = true
    titleInput.minLength = '4'
    titleInput.maxLength = '20'
    descriptionInput.required = true

    formEle.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = handleSubmit(e);
        console.log(...formData.entries());
        await postData(formData);
        
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

postButton.addEventListener("click", (e) => {
    e.preventDefault()
    createForm()
}, { once: true})

//Handle Submit

const handleSubmit = (e) => {
    console.log(e.target)
    return new FormData(e.target);
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

// -- Create Data Validation

//Memorie should have a title

//Memorie should have a Description

//Optional URL

//Optional Image

//Memorie should have a mood



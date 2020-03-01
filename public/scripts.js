const Mask = {
    apply(input, func){
        setTimeout(function() {
            input.value = Mask[func](input.value)
        }, 1)

    },
    formatBRL(value){
        value = value.replace(/\D/g, "")

        return new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)
    }
}

/*Mask.app*/

const PhotosUpload = {
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    
    handleFileInput(event) {/*Aula Upload de imagens/ 1 - Gerenciador de imagens do Front end/ "Lendo imagens com Java Script no Front end"*/

        if (PhotosUpload.hasLimit(event)) return

        Array.from(event.target.files).forEach(file => {
            const reader = new FileReader()
           
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)


                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)            
        });
    },
    hasLimit(event) {
        const  uploadLimit  = PhotosUpload.uploadLimit

        if ( event.target.files.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault() // bloqueia o evento
            return true
        }

        return false

    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        div.onclick = () => alert('remover foto')
        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    }

}
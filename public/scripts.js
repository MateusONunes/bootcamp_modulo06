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

        const {files: fileList } = event.target

        if (PhotosUpload.hasLimit(event, fileList)) return

        Array.from(fileList).forEach(file => {
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

    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        div.onclick = () => alert('remover foto')
        div.appendChild(image)

        return div
    },
    hasLimit(event, fileList) {
        const  uploadLimit  = PhotosUpload.uploadLimit

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault() // bloqueia o evento
            return true
        }

        return false

    }
}
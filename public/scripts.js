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
    uploadLimit: 6,

    handleFileInput(event) {/*Aula Upload de imagens/ 1 - Gerenciador de imagens do Front end/ "Lendo imagens com Java Script no Front end"*/

        const { files: fileList } = event.target
        const  uploadLimit  = PhotosUpload.uploadLimit

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault() // bloqueia o evento
        }

        Array.from(fileList).forEach(file => {
            console.log('x')
            const reader = new FileReader()
            
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = document.createElement('div')
                div.classList.add('photo')
                div.onclick = () => alert('remover foto')
                div.appendChild(image)
                document.querySelector('#photos-preview').appendChild(div)
            }

            reader.readAsDataURL(file)            
        });
    },
}
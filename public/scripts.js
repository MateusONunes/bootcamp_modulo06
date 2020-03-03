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
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    
    handleFileInput(event) {/*Aula Upload de imagens/ 1 - Gerenciador de imagens do Front end/ "Lendo imagens com Java Script no Front end"*/
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {
           
            PhotosUpload.files.push(file)

            const reader = new FileReader()
           
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)


                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)            
        })
        
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
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
    getAllFiles() {/*apos excluir, atualizar o "files" (objeto que contém lista de arquivos selecionados) do html. Video de estudo: "Updload de imagens"/"Gerenciador de imagens no Frontend/Atualizando lista de arquivos"*/
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer() /*a segunda opção é para o firefox pois ele não possui datatransfer*/

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        //div.onclick = () => alert('remover foto')
        div.onclick = PhotosUpload.removePhoto
        
        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {/*feito em 07:55 do video Updload de Imagens/Gerenciador de imagens no Front end/removendo imagens do */
        const photoDiv = event.target.parentNode /*1 acima (componente pai) - <div class="photo"*/
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1) /*remover item do array*/
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    }

}
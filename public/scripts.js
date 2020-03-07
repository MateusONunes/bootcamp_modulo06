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
        const { uploadLimit } = PhotosUpload
        const { preview } = PhotosUpload

        if ( event.target.files.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault() // bloqueia o evento
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = event.target.files.length + photosDiv.length

        if (totalPhotos > uploadLimit) {/*video: "UpLoad de Imagens";Gerenciador de imagens no Front end"/"Regras de limite máximo de envio"*/
            alert(`Você atingiu o limite máximo de ${uploadLimit} fotos`)
            event.preventDefault
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
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}


const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}
const showNotification = () => {
    document.querySelector('.notification').classList.remove('hide');
    document.querySelector('.notification').classList.add('show');

    setTimeout(() => {
        document.querySelector('.notification').classList.remove('show');
        document.querySelector('.notification').classList.add('hide');
    }, 2000);
}

export {
    showNotification
}
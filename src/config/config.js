const config = {
    url:{
        book: "/"
    }
};

if(process.env.NODE_ENV === 'development'){
    config.url.book = "http://" + window.location.hostname +":9999/";
}else{
    config.url.book = process.env.VUE_APP_BASE_URL || "/";
}

export default config


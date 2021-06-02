
export function navTo(navState){
    window.location.href = "#" + encodeURIComponent(window.btoa(JSON.stringify(navState)));
}
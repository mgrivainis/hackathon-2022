function xhrGet (url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let response = null;

    const onLoad = () => {
      
      if (xhr.status >=  400) {

        reject();

      } else {

        const data = xhr.response ? JSON.parse(xhr.response) : null;

        response = {
          status: xhr.status,
          data: data
        };

        resolve(response);
      }
    };

    const onError = () => {
      reject();
    };

    const onLoadEnd = () => {
      xhr.removeEventListener('load', onLoad);
      xhr.removeEventListener('error', onError);
      xhr.removeEventListener('loadend', onLoadEnd);
    };

    xhr.addEventListener('load', onLoad);
    xhr.addEventListener('error', onError);
    xhr.addEventListener('loadend', onLoadEnd);

    xhr.open('GET', url);
    xhr.send();
  });
}

export function getBreezometerData (lat, long) {
  const url = `https://api.breezometer.com/pollen/v2/forecast/daily?lat=${ lat }&lon=${ long }&key=b3a4ffb2b57d41b99d799360e5ece8c9&features=types_information,plants_information&days=3&metadata=true`;

  return xhrGet(url);
}

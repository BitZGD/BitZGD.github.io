function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Función para obtener las releases de GitHub
async function getDownloadCount(url, containerId) {
    try {
        const response = await fetch(url);
        const releases = await response.json();

        var realname = localStorage.getItem('realname');

        const nameheader = document.getElementById('stats-header');
        nameheader.textContent = realname + " Stats";
        releases.forEach((release, index) => {
            const releaseContainer = document.createElement('div');
            releaseContainer.classList.add('release-container');

            const releaseTitle = document.createElement('h2');
            releaseTitle.textContent = release.name || 'Unnamed Release';
            releaseContainer.appendChild(releaseTitle);

            const releaseNameElement = document.createElement('div');
            releaseNameElement.classList.add('release-name');
            releaseNameElement.textContent = `Release ${index + 1}`;
            releaseContainer.appendChild(releaseNameElement);

            const downloadCounts = release.assets.map(asset => asset.download_count);
            const totalDownloads = downloadCounts.reduce((acc, count) => acc + count, 0);

            const downloadCountText = document.createElement('p');
            downloadCountText.classList.add('download-count');
            downloadCountText.textContent = `${totalDownloads} Downloads`;
            releaseContainer.appendChild(downloadCountText);

            const tagText = document.createElement('p');
            tagText.classList.add('tag');
            tagText.textContent = `Tag: ${release.tag_name}`;
            releaseContainer.appendChild(tagText);

            const descriptionText = document.createElement('p');
            descriptionText.classList.add('description');
            descriptionText.textContent = `Description: ${release.body}`;
            releaseContainer.appendChild(descriptionText);

            document.getElementById(containerId).appendChild(releaseContainer);
        });
    } catch (error) {
      
        throw error;
    }
}

var modUrl = getParameterByName('url');
var modVersion = localStorage.getItem('modVersion');
var modName = modUrl.replace('./', '');
var githubUrl = 'https://raw.githubusercontent.com/geode-sdk/mods/main/mods-v2/' + modName + '/' + modVersion + "/entry.json";

fetch(githubUrl)
.then(response => response.json())
.then(data => {

    var downloadUrl = data.mod.download;
    var parts = downloadUrl.split('/');
    var author = parts[3]; 
    var modName = parts[4]; 

    var githubApiUrl = 'https://api.github.com/repos/' + author + '/' + modName + '/releases';
    return getDownloadCount(githubApiUrl, 'generic-container')
    .catch(gitGayError => {
        console.error('github link failed!', gitGayError);
        var gitGayUrl = 'https://git.gay/api/v1/repos/' + author + '/' + modName + '/releases';
        getDownloadCount(gitGayUrl, 'generic-container');
       
    });
})
.catch(error => {
    console.error('Error al obtener datos del mod desde GitHub:', error);
});



const fetchData = () => {
  const userChannel = localStorage.getItem("userChannel");
  const response = fetch(
    `http://localhost:8080/api/tracking?userChannel=${userChannel}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const container = document.getElementById("timeline");

      data.forEach((item) => {
        const newItem = document.createElement("div");
        newItem.classList.add(".uk-timeline-item");

        newItem.innerHTML = `
        <div class="uk-timeline-icon">
        <span class="uk-badge"><span uk-icon="check"></span></span>
      </div>
      <div class="uk-timeline-content">
        <div
          class="uk-card uk-card-default uk-margin-medium-bottom uk-overflow-auto"
        >
          <div class="uk-card-header">
            <div class="uk-grid-small uk-flex-middle" uk-grid>
              <h3 class="uk-card-title">
                <time
                  >${item.videoTitle}</time
                >
              </h3>
              <span class="uk-label uk-label-success uk-margin-auto-left"
                >${item.timeViewed} / ${item.totalVideoTime}</span
              >
            </div>
          </div>
          <div class="uk-card-body">
            <p class="uk-text-success">
              ${item.videoUrl}
            </p>
          </div>
        </div>
      </div>
        `;
        container.appendChild(newItem);
      });
    });
};

fetchData();

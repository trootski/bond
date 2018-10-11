document.addEventListener("DOMContentLoaded", async function(e) {
  const loader = document.querySelector('#loading');
  const mainHolder = document.querySelector('#filmCard');
  const nextBtn = document.querySelector('#back');
  try {
    const renderFilm = (data) => {
      renderTitle(data.Title, mainHolder)
      renderYear(data.Year, mainHolder)
      renderPlot(data.Plot, mainHolder)
      renderPoster(data.Poster, mainHolder)
      return 1;
    };
    const renderTitle = (title, el) => {
      const h1 = el.querySelector('h1');
      h1.innerText = title;
      return h1;
    };
    const renderYear = (year, el) => {
      const yearEm = el.querySelector('em');
      yearEm.innerText = year;
      return yearEm;
    };
    const renderPoster = (poster, el) => {
      const posterEl = el.querySelector('div.img img')
      posterEl.src = poster;
      return posterEl;
    };
    const renderPlot = (plot, el) => {
      const plotEl = el.querySelector('p');
      plotEl.innerHTML = `<h4>Synopsis</h4>${plot}`;
      return plotEl;
    };
    const op = await fetch('//localhost:3000/films', {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    });
    if (op.status !== 200) {
      loader.innerText = 'error loading film data';
    } else {
      document.body.classList.add('loaded');
      const filmDB = await op.json();
      console.log(filmDB.data[0]);
      renderFilm(filmDB.data[0]);
    }
  } catch (e) {
      console.error(e);
  }
});


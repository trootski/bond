document.addEventListener("DOMContentLoaded", async function(e) {
  const loader = document.querySelector('#loading');
  const mainHolder = document.querySelector('#filmCard');
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
  const m = function() {
    this.data = {};
    this.set = (prop, val) => {
      if (prop === 'currentIndex') {
        if (val < 0) {
          this.data[prop] = this.data['filmDB'].length - 1;
        } else if (val >= this.data['filmDB'].length) {
          this.data[prop] = 0;
        } else {
          this.data[prop] = val;
        }
        renderFilm(this.data['filmDB'][this.data[prop]]);
      } else {
        this.data[prop] = val;
      }
      return this;
    };
    this.get = (prop) => this.data[prop];
    return this;
  }();
  const backBtn = document.querySelector('#back');
  backBtn.addEventListener('click', (e) => {
    m.set('currentIndex', m.get('currentIndex') - 1);
  });
  const nextBtn = document.querySelector('#next');
  nextBtn.addEventListener('click', (e) => {
    m.set('currentIndex', m.get('currentIndex') + 1);
  });
  try {
    const op = await fetch('//localhost:3000/films', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
    if (op.status !== 200) {
      loader.innerText = 'error loading film data';
    } else {
      document.body.classList.add('loaded');
      const filmRes = await op.json();
      m.set('filmDB', filmRes.data);
      m.set('currentIndex', 0);
    }
  } catch (e) {
      console.error(e);
  }
});


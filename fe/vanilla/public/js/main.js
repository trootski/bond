document.addEventListener("DOMContentLoaded", async function(e) {
  const apiURLs = {
    'nodejs': '//localhost:3001/v1/bond-movies',
    'spring-dynamodb':  '//localhost:3002/v1/bond-movies',
    'spring-postgresql':  '//localhost:3003/v1/bond-movies',
  };
  const loader = document.querySelector('#loading');
  const mainHolder = document.querySelector('#filmCard');
  const renderFilm = (data) => {
    renderTitle(data.title, mainHolder)
    renderYear(data.year, mainHolder)
    renderPlot(data.synopsis, mainHolder)
    renderReview(data.review, mainHolder)
    renderPoster(data.poster, mainHolder)
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
    const imgLoadedHandler = () => {
        console.log('img has been loaded');
      posterEl.classList.remove('loadingImg');
    }
    const posterHolderEl = el.querySelector('div.img');
    posterHolderEl.classList.add('loadingImg');
    const posterEl = posterHolderEl.querySelector('img')
    posterEl.removeEventListener('load', imgLoadedHandler );
    posterEl.addEventListener('load', imgLoadedHandler, false)
    posterEl.src = poster;
    return posterEl;
  };
  const renderPlot = (plot, el) => {
    const plotEl = el.querySelector('p');
    plotEl.innerHTML = `<h4>Synopsis</h4>${plot}`;
    return plotEl;
  };
  const renderReview = (review, el) => {
    const plotEl = el.querySelector('aside');
    plotEl.innerHTML = `<h4>Review</h4>${review}`;
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
  const handleAPIChange = evt => {
    const ele = evt.target;
    if (ele.checked) {
      m.set('currentAPI', ele.value);
      render();
    }
  };
  const apiBtns = Object.keys(apiURLs).forEach(v => {
    const ele = document.querySelector(`#${v}`);
    ele.addEventListener('change', handleAPIChange);
    console.log(v);
  });
  m.set('currentAPI', 'nodejs');
  const render = async () => {
    document.body.classList.remove('loaded');
    try {
      const op = await fetch(apiURLs[m.get('currentAPI')], {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
      if (op.status !== 200) {
        loader.innerText = 'error loading film data';
      } else {
        document.body.classList.add('loaded');
        const filmRes = await op.json();
        m.set('filmDB', filmRes);
        m.set('currentIndex', 0);
      }
    } catch (e) {
        console.error(e);
    }
  };
  render();
});


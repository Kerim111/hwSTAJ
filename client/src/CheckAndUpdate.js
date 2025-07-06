// CheckAndUpdate.js
import axios from 'axios';
import compareDates from './compartedates';


function CheckAndUpdate(date, setDate, setData, setLastDBping) {
  if (date == null) {
    // First time: load tree, then status
    axios.get(`${baseURL}/update`)
      .then(res => {
        setData(res.data);
        return axios.get(`${baseURL}/LastUpdate`);
      })
      .then(res => {
        // res.data is now { lastUpdate, LastDBping }
        
        setDate(new Date(res.data.lastUpdate).toLocaleString());
        setLastDBping(new Date(res.data.LastDBping).toLocaleString());
      })
      .catch(err => console.error(err));
  } else {
    // Subsequent polls: only refetch when the DB timestamp changes
    axios.get(`${baseURL}/LastUpdate`)
      .then(res => {
        const { lastUpdate, LastDBping } = res.data;
        if (compareDates(date, lastUpdate) < 0) {
          setDate(new Date(lastUpdate).toLocaleString());
          setLastDBping(new Date(LastDBping).toLocaleString());
          return axios.get(`${baseURL}/update`)
            .then(r => setData(r.data));
        }
      })
      .catch(err => console.error(err));
  }
}

export default CheckAndUpdate;

import axios from 'axios';

export const findMutualFreeTime = (intervalListA, intervalListB) => {
    //instantiate pointers for each list
    let a = 0,
        b = 0,
        intersections = [];
    //iterate through each interval list until you've reach the end of one list
    while (a < intervalListA.length && b < intervalListB.length) {
    //check if the intervals do not overlap and increment whichever pointer is at the earlier interval
        if (Number(intervalListA[a].end) <= Number(intervalListB[b].start)) {
            a++
        } else if (Number(intervalListB[b].end) <= Number(intervalListA[a].start)) {
            b++
        } 
    //if the intervals overlap, add the intersection to our results and increment the interval that ends earlier
          else {
            let intersection = [];
            if (Number(intervalListA[a].start) < Number(intervalListB[b].start)) {
                intersection.push(intervalListB[b].start);
            } else {
                intersection.push(intervalListA[a].start);
            }
            if (Number(intervalListA[a].end) > Number(intervalListB[b].end)) {
                intersection.push(intervalListB[b].end);
                b++
            } else {
                intersection.push(intervalListA[a].end);
                a++
            }
            intersections.push(intersection);
        }
    }
    return intersections
}

export async function createUser(data) {
    try {
        const response = await axios.post('/api/users/register/', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return error;
    }
}

export async function loginUser(data) {
    try {
        const response = await axios.post('/api/users/token/obtain/', data, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });
        axios.defaults.headers.common['Authorization'] = "JWT " + response.data.access;

        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export async function getUsers() {
    try {
        const response = await axios.get('/api/users/all', {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                const refreshResponse = await axios.post('/api/users/token/refresh/', {
                    refresh: refreshToken,
                });
                
                const newAccessToken = refreshResponse.data.access;
                localStorage.setItem('access_token', newAccessToken);
                
                const retryResponse = await axios.get('/api/users/all', {
                    headers: {
                        'Authorization': "JWT " + newAccessToken,
                        "Content-Type": "application/json"
                    }
                });
                
                return retryResponse.data;
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }
        }
        console.error("Error fetching data:", error);
        return null;
    }
}

export async function getUser() {
    try {
        const response = await axios.get(`/api/users/account`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data[0];
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Access token has expired; attempt to refresh it
            try {
                // Get the refresh token from local storage
                const refreshToken = localStorage.getItem('refresh_token');
                // Send a request to the Django server to refresh the token
                const refreshResponse = await axios.post('/api/users/token/refresh/', {
                    refresh: refreshToken,
                });
                // Update the stored access token with the new one
                const newAccessToken = refreshResponse.data.access;
                localStorage.setItem('access_token', newAccessToken);
                // Retry the original request with the new access token
                const retryResponse = await axios.get('/api/users/account', {
                    headers: {
                        'Authorization': "JWT " + newAccessToken,
                        "Content-Type": "application/json"
                    }
                });
                return retryResponse.data[0];
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }
        }
        // Handle other errors
        console.error("Error fetching data:", error);
        return null;
    }
}

export async function getAvailability(year, month, day) {
    try {
        const response = await axios.get(`/api/users/availability/${year}/${month}/${day}/`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data[0].times;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                const refreshResponse = await axios.post('/api/users/token/refresh/', {
                    refresh: refreshToken,
                });
                
                const newAccessToken = refreshResponse.data.access;
                localStorage.setItem('access_token', newAccessToken);
                
                const retryResponse = await axios.get(`/api/users/availability/${year}/${month}/${day}/`, {
                    headers: {
                        'Authorization': "JWT " + newAccessToken,
                        "Content-Type": "application/json"
                    }
                });
                console.log(retryResponse);
                return retryResponse.data[0].times;
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }
        }
        console.error("Error fetching data:", error);
        return null;
    }
}

export async function addAvailability(year, month, day, times) {
    try {
        const response = await axios.post(`/api/users/availability/`, {
            year: year,
            month: month,
            day: day,
            times: times
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                const refreshResponse = await axios.post('/api/users/token/refresh/', {
                    refresh: refreshToken,
                });
                
                const newAccessToken = refreshResponse.data.access;
                localStorage.setItem('access_token', newAccessToken);
                
                const retryResponse = await axios.post(`/api/users/availability/`, {
                    year: year,
                    month: month,
                    day: day,
                    times: times
                }, {
                    headers: {
                        'Authorization': "JWT " + newAccessToken,
                        "Content-Type": "application/json"
                    }
                });
                
                return retryResponse.data;
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }
        }
        console.error("Error fetching data:", error);
        return null;
    }
}

export async function updateAvailability(year, month, day, times) {
    try {
        const response = await axios.put(`/api/users/updateavailability/${year}/${month}/${day}/`, {
            times: times
        }, {
            headers: {
                'Authorization': "JWT " + localStorage.getItem('access_token'),
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                const refreshResponse = await axios.post('/api/users/token/refresh/', {
                    refresh: refreshToken,
                });
                
                const newAccessToken = refreshResponse.data.access;
                localStorage.setItem('access_token', newAccessToken);
                
                const retryResponse = await axios.put(`/api/users/updateavailability/${year}/${month}/${day}/`, {
                    times: times
                }, {
                    headers: {
                        'Authorization': "JWT " + newAccessToken,
                        "Content-Type": "application/json"
                    }
                });
                
                return retryResponse.data;
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }
        }
        console.error("Error fetching data:", error);
        return null;
    }
}

export async function getWorkouts() {
    try {
        const response = await axios.get(`/api/appointments`, {
            headers: {
                'Authorization': "JWT " + localStorage.getItem('access_token'),
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                const refreshResponse = await axios.post('/api/users/token/refresh/', {
                    refresh: refreshToken,
                });
                
                const newAccessToken = refreshResponse.data.access;
                localStorage.setItem('access_token', newAccessToken);
                
                const retryResponse = await axios.get(`/api/appointments`, {
                    headers: {
                        'Authorization': "JWT " + newAccessToken,
                        "Content-Type": "application/json"
                    }
                });
                
                return retryResponse.data;
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return refreshError;
            }
        }
        console.error("Error fetching data:", error);
        return null;
    }
}

export async function createWorkout(date, time, users) {
    try {
        const response = await axios.post(`/api/appointments/${users[1]}/`, {
            date: date,
            time: time,
            users: users,
            video: "placeholder"
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                const refreshResponse = await axios.post('/api/users/token/refresh/', {
                    refresh: refreshToken,
                });
                
                const newAccessToken = refreshResponse.data.access;
                localStorage.setItem('access_token', newAccessToken);
                
                const retryResponse = await axios.post(`/api/appointments/${users[1]}/`, {
                    date: date,
                    time: time,
                    users: users,
                    video: "placeholder"
                }, {
                    headers: {
                        'Authorization': "JWT " + newAccessToken,
                        "Content-Type": "application/json"
                    }
                });
                
                return retryResponse.data;
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }
        }
        console.error("Error fetching data:", error);
        return null;
    }
}

export async function addVideo(workout, videoID) {
    try {
        const response = await axios.put(`/api/appointment/${workout}/`, {
            video: videoID
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                const refreshResponse = await axios.post('/api/users/token/refresh/', {
                    refresh: refreshToken,
                });
                
                const newAccessToken = refreshResponse.data.access;
                localStorage.setItem('access_token', newAccessToken);
                
                const retryResponse = await axios.put(`/api/appointment/${workout}/`, {
                    video: videoID
                }, {
                    headers: {
                        'Authorization': "JWT " + newAccessToken,
                        "Content-Type": "application/json"
                    }
                });
                
                return retryResponse.data;
            } catch (refreshError) {
                console.error("Error refreshing access token:", refreshError);
                return null;
            }
        }
        console.error("Error fetching data:", error);
        return null;
    }
}

export async function contactUs(data) {
    try {
        const response = await axios.post('/api/contact/', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return error;
    }
}

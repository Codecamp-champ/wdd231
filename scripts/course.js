const courses = [
    {
        "subject": "CSE",
        "number": 110,
        "title": "Introduction to Web Programming",
        "credits": 3,
        "completed": true // Example: Set to true if you completed it
    },
    {
        "subject": "WDD",
        "number": 130,
        "title": "Web Fundamentals",
        "credits": 2,
        "completed": true // Example: Set to true if you completed it
    },
    {
        "subject": "CSE",
        "number": 111,
        "title": "Programming with Functions",
        "credits": 3,
        "completed": false
    },
    {
        "subject": "WDD",
        "number": 231,
        "title": "Web Backend Development", // Assumed distinct WDD 231 entries
        "credits": 3,
        "completed": false
    },
    {
        "subject": "WDD",
        "number": 231,
        "title": "Web Frontend Development", // Assumed distinct WDD 231 entries
        "credits": 3,
        "completed": false
    },
    {
        "subject": "CSE",
        "number": 210,
        "title": "Programming with Classes",
        "credits": 3,
        "completed": false
    },
    {
        "subject": "WDD",
        "number": 331,
        "title": "Advanced Web Development",
        "credits": 3,
        "completed": false
    },
    {
        "subject": "CSE",
        "number": 341,
        "title": "Web Services",
        "credits": 3,
        "completed": false
    },
    {
        "subject": "CSE",
        "number": 450,
        "title": "Capstone Project",
        "credits": 3,
        "completed": false
    },
    {
        "subject": "CSE",
        "number": 337,
        "title": "Database Driven Web Development",
        "credits": 3,
        "completed": false
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const courseCardsContainer = document.getElementById('course-cards-container'); // Changed ID to match HTML
    const filterAllBtn = document.getElementById('filter-all');
    const filterWddBtn = document.getElementById('filter-wdd');
    const filterCseBtn = document.getElementById('filter-cse');
    const totalCreditsSpan = document.getElementById('total-credits'); // Changed ID to match HTML

    // Function to create a course card DOM element
    function createCourseCard(course) {
        const card = document.createElement('div');
        card.classList.add('course-card');
        if (course.completed) {
            card.classList.add('completed');
        }

        card.innerHTML = `
            <h3>${course.subject} ${course.number}</h3>
            <p><strong>Title:</strong> ${course.title}</p>
            <p><strong>Credits:</strong> ${course.credits}</p>
        `;
        return card;
    }

    // Function to display courses in the container
    function displayCourses(courseList) {
        courseCardsContainer.innerHTML = ''; // Clear existing cards before adding new ones
        if (courseList.length === 0) {
            courseCardsContainer.innerHTML = '<p>No courses to display in this category.</p>';
        } else {
            courseList.forEach(course => {
                courseCardsContainer.appendChild(createCourseCard(course));
            });
        }
        updateTotalCredits(courseList); // Update credits after displaying courses
    }

    // Function to update total credits for the CURRENTLY DISPLAYED courses
    function updateTotalCredits(courseList) {
        const totalCredits = courseList.reduce((sum, course) => sum + course.credits, 0);
        totalCreditsSpan.textContent = totalCredits;
    }

    // Initial display: Show all courses when the page loads
    displayCourses(courses);

    // Event listeners for filter buttons
    filterAllBtn.addEventListener('click', () => {
        displayCourses(courses); // Show all original courses
    });

    filterWddBtn.addEventListener('click', () => {
        const wddCourses = courses.filter(course => course.subject === 'WDD');
        displayCourses(wddCourses);
    });

    filterCseBtn.addEventListener('click', () => {
        const cseCourses = courses.filter(course => course.subject === 'CSE');
        displayCourses(cseCourses);
    });
});
//accessing dom elements
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedback-form');
  const searchBar = document.getElementById('search-bar');
  const feedbackList = document.getElementById('feedback-list');
  const loader = document.getElementById('loader');

  const allFeedbacks = []; //to store feedbacks

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const feedback = {
      name: formData.get('full-name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      description: formData.get('description'),
      rating: formData.get('rating'),
      tags: formData.get('tags').split(',').map(tag => tag.trim()),
      files: formData.getAll('files'),
    };

    if (isValidForm(feedback)) {
      await handleFileUploads(feedback.files);
      await submitFeedback(feedback);
      allFeedbacks.push(feedback);
      displayFeedback(allFeedbacks);
      form.reset();
    } else {
      alert('Please fill in all fields correctly.');
    }
  });

  // Direct Search Input
  searchBar.addEventListener('input', async (e) => {
    const query = e.target.value.toLowerCase();

    loader.style.display = 'block';
    feedbackList.innerHTML = ''; // Clear previous list

    const results = await searchFeedback(query);
    setTimeout(() => {
      displayFeedback(results);
      loader.style.display = 'none';
    }, 500); // Simulate loading delay
  });

  function isValidForm(feedback) {
    return (
      feedback.name &&
      feedback.email &&
      feedback.subject &&
      feedback.description.length >= 50 &&
      feedback.rating >= 1 &&
      feedback.rating <= 5
    );
  }

  async function handleFileUploads(files) {
    try {
      for (const file of files) {
        if (!file.name) continue;
        console.log(`Uploading ${file.name}...`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      alert('File upload failed: ' + error.message);
    }
  }

  async function submitFeedback(feedback) {
    console.log('Submitting feedback:', feedback);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'mock_submission_id';
  }

  async function searchFeedback(query) {
    return allFeedbacks.filter(feedback =>
      feedback.name.toLowerCase().includes(query) ||
      feedback.subject.toLowerCase().includes(query) ||
      feedback.description.toLowerCase().includes(query) ||
      feedback.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  function displayFeedback(feedbacks) {
    feedbackList.innerHTML = '';
    if (feedbacks.length === 0) {
      feedbackList.innerHTML = '<li>No feedback found.</li>';
      return;
    }

    feedbacks.forEach(feedback => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${feedback.name}</strong> - <em>${feedback.subject}</em><br>
        <small>${feedback.description.substring(0, 100)}...</small><br>
        <b>Rating:</b> ${feedback.rating} | <b>Tags:</b> ${feedback.tags.join(', ')}
        <hr/>
      `;
      feedbackList.appendChild(li);
    });
  }
});

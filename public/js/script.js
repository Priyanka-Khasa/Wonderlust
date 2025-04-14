(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  // Add real-time validation on field blur
  const addRealTimeValidation = (form) => {
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => {
        if (form.classList.contains('was-validated')) {
          validateField(input)
        }
      })
    })
  }

  const validateField = (input) => {
    if (input.checkValidity()) {
      input.classList.remove('is-invalid')
      input.classList.add('is-valid')
    } else {
      input.classList.remove('is-valid')
      input.classList.add('is-invalid')
    }
  }

  Array.from(forms).forEach(form => {
    addRealTimeValidation(form)
    
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        
        // Validate all fields to show errors
        form.querySelectorAll('input, select, textarea').forEach(validateField)
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const filtersWrapper = document.getElementById("filtersWrapper");

  function scrollLeft() {
    filtersWrapper.scrollBy({ left: -150, behavior: "smooth" });
  }

  function scrollRight() {
    filtersWrapper.scrollBy({ left: 150, behavior: "smooth" });
  }

  document.getElementById("taxToggle").addEventListener("click", () => {
   let taxInfo=document.getElementsByClassName("tax-info");
   for (info of taxInfo){
    if(info.style.display !="inline"){
    info.style.display="inline";
    }else{
    info.style.display="none";
   }
  }
  });

  document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.search-bar');
    
    // Handle clicks on search sections
    searchBox.addEventListener('click', function(e) {
      const section = e.target.closest('.search-section');
      if (!section || e.target.closest('.search-btn')) return;
      
      // Create input field
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'search-input';
      input.value = section.textContent;
      input.style.minWidth = section.offsetWidth + 'px';
      
      // Replace text with input
      section.replaceWith(input);
      input.focus();
      
      // Handle input blur
      input.addEventListener('blur', function() {
        const newSection = document.createElement('div');
        newSection.className = 'search-section';
        newSection.id = section.id;
        newSection.textContent = input.value || section.textContent;
        input.replaceWith(newSection);
      });
      
      // Handle Enter key
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') input.blur();
      });
    });
  });
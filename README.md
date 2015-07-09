# prevent-autofill.js
Attempts to prevent browser autofill features from accessing form inputs. Specifically created to combat Chrome's autofill functionality. Chrome didn't seem to care about my "autocomplete" settings on any type of address form, regardless of which element the autocomplete attribute was placed on. Only dependency is jQuery. 

Use: Execute preventAutofill() on any inputs that you'd like protected from autofill.

$(input selector).preventAutofill();

NOTE: I currently only support characters a-z, A-Z, 0-9, space and some basic symbols. I only provided support for  characters that I would need to fill out an address form.

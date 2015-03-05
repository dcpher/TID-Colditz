/*
  Rough implementation of how you might set up the autocompleter.
  
  I think general concepts such as storing which countries the user is going to as hidden inputs is sound, and things such as autocompleter setup pretty much have to be the way they are. 
  
  Feel free to clean up / change things though, this is just a version of "What Jai rekons".
  
  Let me know if you think the autocompleter needs any changes / updates.

  - Jai
*/


(function($) {
  $.fn.extend({
    countrySelector: function(containerSelector, countriesWithAliases, opt) {
      opt = $.extend({
        panelData: null
      }, opt);
    
      var utils = {
        
      };
      
      return this.each(function() {
        
        var self = $(this)
          
          .bind('init.countrySelector', function() {
            // Replaces the select with an input
            var autocompleterInput = $("<input id='autocompleter' />");
            var destinations = $("<ul id='destinations'></ul>");
            self.find(containerSelector)
              .html(destinations)
              .append(autocompleterInput);
              
            self.data('destinations', destinations);
            self.data('autocompleterInput', autocompleterInput);
            
            if (opt.panelData) {
              self.trigger('createCountryPanel');
            }
            
            self.trigger('setupAutocompleter');
            self.trigger('setupDestinations');
            
            self.trigger('addListeners');
          })
          
          .bind('setupAutocompleter', function() {
            self.data('autocompleterInput').autocomplete(countriesWithAliases, {
              // Pass in big panel of counties
              instructions: self.data('countryPanel'),
              
              alignment: 'left',
              leftOffset: 0,
              fadeInSpeed: 700, 
              // Custom match method is required as the countries array isn't just country names, but is a combination of names and aliases.
              // This only pulls counties if there is just one letter, but after that searches both countries and the aliases
              matchFromLocal: function(text, list, exact) {
                var matches = [];

                text = text.toLowerCase();

                $.each(list, function(i, item) {
                  name = item[0].toLowerCase();
                  if (exact ? (name == text) : (name.indexOf(text) != -1)) {
                    matches.push(item);
                  } else if (item[1] && text.length > 1) {

                    // If there are alises
                    for (var i=0; i < item[1].length; i++) {
                      var alias = item[1][i].toLowerCase();;

                      if (exact ? (alias == text) : (alias.indexOf(text) != -1)) {
                        matches.push(item);
                        break; 
                      }
                    };
                  }
                });

                return matches;
              },
              
              // Custom matchTemplate method is required as the countries array isn't just country names, but is a combination of names and alises.
              // This checks if the string the user searched for can be found in the country name. If it can't, it picks the shortest alias of the country that contains the string to display as well.
              matchTemplate: function(item, searchText, highlightMethod) {
                var displayText;
                var country = item[0].toLowerCase();
                searchText = searchText.toLowerCase();

                // First check if what the user entered matches the country
                if (!item[1] || country.indexOf(searchText) != -1) {
                  displayText = item[0];
                } else {
                  // Otherwise, find which aliases are matched
                  var matchingAliases = [];

                  for (var i=0; i < item[1].length; i++) {
                    var alias = item[1][i].toLowerCase();
                    if (alias.indexOf(searchText) != -1) {
                      matchingAliases.push(item[1][i]);
                    }
                  };

                  // We only want to display one alias, so pick the shortest one
                  matchingAliases = matchingAliases.sort(function(a, b) {
                    return a.length - b.length;
                  });

                  displayText = item[0] + " (" + matchingAliases[0] + ")";
                }


                return highlightMethod(searchText, displayText);
              }
            })
            
            // Listen in on the autocomlpeters itemChosen method, passing through data and the selectedListItem to addCountry 
            .bind('itemChosen', function(e, data, textUserEntered, selectedListItem) {
              self.data('autocompleterInput').val('');
              self.trigger('addCountry', [data, selectedListItem]);
              
            });
          })
          
          
          // Build the big menu
          .bind('createCountryPanel', function() {
            var countryPanel = $("<div/>").attr('id', 'countryPanel');
            
            $('<h3/>').text("Choose a country or start typing its name").appendTo(countryPanel);
            
            var regions = $('<div/>').addClass('regions').appendTo(countryPanel);
            
            $.each(opt.panelData, function(i, region) {
              var dl = $("<dl/>").addClass(region.name.toLowerCase()).addClass('region');
              $("<dt/>").text(region.name).appendTo(dl);
              
              $.each(region.countries, function(i, countryName) {
                $("<dd><a>" + countryName + "</a></dd>").appendTo(dl);
              });
              
              regions.append(dl);
            });
            
            self.data('countryPanel', countryPanel);
          })
          
          .bind('setupDestinations', function() {
            // Add a click listener to the destinations element, this looks for clicks on anchors and then removes the li as well as the hidden input
            self.data('destinations')
              .bind('click', function(e) {
                var target = $(e.target);

                if (target.is('a')) {
                  var item = target.closest('li');
                  var countryName = item.data('countryData')[0];
                  self.find("input[name='countries[]'][value='" + countryName + "']").remove();
                  item.remove();
                }
              });
          })
          
          // Add a country displays an li to the user of the country they selected, as well as creating a hidden input in the form for submission. 
          // This hidden input is "the truth" and trusted over the destinations ul. 
          // If the user selected from the autocompleter (as opposed to an exact match) then that li will be passed through, and the text of that is what we display to the user.
          .bind('addCountry', function(e, data, selectedListItem) {
            var countryName = data[0];
            var countryDisplayName;
            
            if (selectedListItem) {
              countryDisplayName = selectedListItem.text();
            } else {
              countryDisplayName = countryName;
            }
            
            if (!self.find("input[name='countries[]'][value='" + countryName + "']")[0]) {
              var hiddenInput = $('<input/>', {
                'value': countryName,
                'name': 'countries[]',
                'type': 'hidden'
              });

              self.append(hiddenInput);

              var destination = $('<li>' + countryDisplayName + ' <a>remove</a></li>')
                                 .data('countryData', data);

              self.data('destinations').append(destination);
             
              destination.hide().fadeIn();
            }
          })
         
          .bind('addListeners', function() {
            // Whenever the instructions are shown, bind a click listener to it and check for clicks on anchors, if one is found
            // then set the input text and find an exact match using the autocompleter
            self.data('autocompleterInput')
              .bind('instructionsShown', function(e, instructions) {
                instructions.bind('click.countrySelector', function(e) {
                  var target = $(e.target);
                
                  if (target.is('a')) {
                    self.data('autocompleterInput')
                      .val(target.text())
                      .trigger('findExactMatches')
                      .trigger('removeInstructions');
                  
                    return false;
                  }
                });
                  
              })
              
              // Listen for errors from the autocompleter. Idealy you want to hook this in to whatever error handler you are using for the whole form.
              // Currently the only error you will get is when an exact match fails.
              .bind('errorFeedback.autocomplete', function(e, type, details) {
                console.log("Error: " + type);
                console.log(details);
              });
          });
          
        self.trigger('init.countrySelector');
      });
    }
  });
})(jQuery);

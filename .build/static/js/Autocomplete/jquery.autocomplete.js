/*

jquery.autocomplete.js by Jaidev Soin

Usage:
$(input).autocomplete(url || array of data, options);
  
Ajax mode:
  
If the first parameter is a URL (string), the autocompleter will work using aysnc JSON requests to that url. It will pass a cleansed version of what
the user entered as the 'text' parameter. The results returned should be of the form:
  
{
matches: [
match1,
match2
]
}
  
If exact matching is occuring, an additional url paramter of 'exact=true' will be passed, matching should then only occur on exact terms, with results
returned in the form:
  
{
matches: [
match1,
match2
],
failed: {
termThatFailedToMatch1,
termThatFailedToMatch2
}
}
    
The server is responsible for splitting multiple terms in the users text on symbols such as ',' and 'and', have a look within for how we do it locally if you want an example
    
If requesting remote matches, it is advised to set the typingTimeOut option to something like 500 milliseconds
  
  
Local matching:
    
If the first paramater is an array, matching will occur using the opt.matchFromLocal method. This is responsible for both exact and partial matching.
  
  
Data passed to autocompleter:
    
By default, the autocompleter expects either an array of strings as ajax result, or an array of strings to search through to find matches. If you want to use any other data format, you need to override opt.matchFromLocal and opt.matchTemplate. Finally, keep in mind that the order of data passed to the autocompleter is significant, affecting both the order of results as well as their grouping.

Triggers you might want to listen for:

itemChosen(data, textUserEntered, (optional)selectedListItem)
errorFeedback.autocomplete(errorType, errorDetails)
instructionsShown(instructionsElement)
autocompleterShown(autocompleterElement)
showInstructions
showMatches(matches, textUserEntered)
nextSelected(selectedElement)
previousSelected(selectedElement)
removeAutocompleter
removeInstructions
findingExactMatchesFor(filteredTextInInput, triggeringAction)
  
  
Triggers you might want to use yourself:

itemChosen(data, textuserEntered)
showMatches(matches, textUserEntered)
triggerUseSelectedOrFindMatch
useSelectedItem((optional)triggeringAction)
findExactMatches((optional)triggeringAction)
showInstructions
selectNext
selectPrevious
removeAutocompleter
removeInstructions

Data you might find useful:

Each li in the autocompleter has .data('dataObject), containing the data object that was matched against.

*/

(function ($) {
  var KEY = {
    ESC: 27,
    RETURN: 13,
    TAB: 9,
    BS: 8,
    DEL: 46,
    UP: 38,
    DOWN: 40,
    SHIFT: 16
  };

  $.fn.extend({
    autocomplete: function (matchSource, opt) {
      opt = $.extend({
        loadingClass: 'loading',              // Class applied to the inupt when an ajax request is in progress
        selectedClass: 'selected',            // Class applied to an item in the list when it is selected (return / click will use that item)
        selectableClass: 'selectable',        // Class applied to an item in the list if it can be selected (not a title)
        groupTitleClass: 'group-title',       // Class applied to the title of a group of items in the list
        autocompleterClass: 'autocomplete',   // Class applied to the ul that is the immediate parent of the list items
        maxItems: 10,                         // Max number of results to show when searching against a local array, does not affect ajax results
        selectFirstItem: true,                // Auto select first item in the list when matches show
        enableExactMatching: true,            // Find exact matches to the users text when nothing is selected, but an action to enter data (such as return or tab) occurs
        typingTimeOut: 0,                     // Number of milliseconds between a keypress and matches showing / an ajax request being fired. Recommend upping for ajax (500),
        fadeInSpeed: 200,                     // Number of miliseconds fading in takes - fading out is not supported for simplicities sake.
        alignment: 'left',                    // Datepicker will be left aligned with the left side of the input. Alternative is 'right'
        getUrlParameters: {},                 // Any additional url paramters to send with the ajax requests
        topOffset: 0,                         // Number of pixels to tweak the intro / autocompleters top offset by
        leftOffset: 0,                        // Number of pixels to tweak the intro / autocompleters left offset by
        anchorTo: null,                       // Element to anchor the autocompleter / instructions to - if null defaults to input
        exactMatchSeperatorRegex: /\s*(?:,|\s&\s|\sand\s)\s*/i,       // Regex for splitting user text into individual terms to be matched
        instructions: $("<div>Start typing to find matches</div>"),   // Element to display to the user on input focus
        groupingTitle: function (match) { return null; },              // What title does this item come under (string, may contain html). Grouping is dependant on order of aray / ajax results
        inputFilter: function (text) { return text; },                 // Allows modification of text the user entered before it is used to match against array / sent with ajax request (return string)
        autocompleterTemplate: function (autocompleter) { return autocompleter; }, // Allows wrapping of autocompleter ul in other elements / addition of extra instructions

        // Create contents of li for a matching item. Can return string, dom element, or jQuery object.
        //    match: matching item from either ajax call or local array. At it's simplest a string but can be anything
        //    textUserEntered: what is in the input field, trimmed and with inputFilter applied
        //    highlightMethod: method to help highlight text, usage is (needle, haystack)
        matchTemplate: function (match, textUserEntered, highlightMethod) {
          return highlightMethod(textUserEntered, match);
        },

        // Used when searching through a passed in array - not used at all when in ajax mode. Returns an array of matches. Can also sort your results in here.
        //    textUserEntered: what is in the input field, trimmed and with inputFilter applied
        //    list: The array that was passed to the autocompleter at init.
        //    exact: Boolean of whether exact matching is required, an explanation of exact matching can be found in the intro of this plugin
        matchFromLocal: function (textUserEntered, list, exact) {
          var matches = [];
          var text = textUserEntered.toLowerCase();
          $.each(list, function (i, item) {
            item = item.toLowerCase();
            if (exact ? (item == text) : (item.indexOf(text) != -1)) {
              matches.push(item);
            }
          });

          return matches;
        }
      }, opt);

      var utils = {
        // Look for terms in a string of text and wrap them in <em>. Regex is there to escape any regex characters that might be in the terms
        highlight: function (terms, text) {
          var termsSafeForRegex = $.trim(terms).replace(/([\\\^\$*+[\]?{}.=!:(|)])/g, "\\$1");

          if (termsSafeForRegex.length == 0) {
            return text;
          } else {
            return text.replace(new RegExp(termsSafeForRegex, 'gi'), function (match) {
              return "<em>" + match + "</em>";
            });
          }
        },

        // Used to insert either the autocompleter, or it's instructions into the dom, positioning it based on the input.
        insertAbsoluteElement: function (input, element, constrainWidth) {
          var width = input.outerWidth() + 'px';
          var top = input.offset().top + input.outerHeight(false) + opt.topOffset;

          element.css({
            'position': 'absolute',
            'top': top + 'px',
            'width': constrainWidth ? width : null
          }).appendTo('body');

          // This has to happen once the datepicker is loaded into the dom so we know how wide it is. The user won't see it move at all.
          utils.setAbsoluteElementsLeftProperty(input, element);
        },

        // Sets the CSS left property of the element based on the position of the input and opt.alignment
        setAbsoluteElementsLeftProperty: function (input, element) {
          var left = input.offset().left + opt.leftOffset;

          if (opt.alignment == 'right') {
            left = left + input.outerWidth() - element.outerWidth();
          }

          element.css('left', left + 'px');
        },

        // Retuns the the field in the same form that is plus or minus the passed in index
        getFieldByRelativeTabIndex: function (field, relativeIndex) {
          var fields = $(field.closest('form')
          .find('a[href], button, input, select, textarea')
          .filter(':visible').filter(':enabled')
          .toArray()
          .sort(function (a, b) {
            return ((a.tabIndex > 0) ? a.tabIndex : 1000) - ((b.tabIndex > 0) ? b.tabIndex : 1000);
          }));

          return fields.eq((fields.index(field) + relativeIndex) % fields.length);
        },

        // Convinience method to grab the next field
        nextField: function (field) {
          return utils.getFieldByRelativeTabIndex(field, 1);
        },

        // Convinience method to grab the previous field
        previousField: function (field) {
          return utils.getFieldByRelativeTabIndex(field, -1);
        }
      };

      return this.each(function () {
        var self = $(this)


          .bind('init.autocomplete', function () {
            self.attr('autocomplete', 'off');

            self.triggerHandler('addClickOutsideListener.autocomplete');
            self.triggerHandler('addWindowResizeListener.autocomplete');
          })


          .bind('keydown.autocomplete', function (e) {
            var allowAction = true;
            // Keycode should work in all browsers (thanks to jQuery), if not build in support for .which as well
            switch (e.keyCode) {
              case KEY.ESC:
                if (self.data('typingTimeOut')) {
                  clearInterval(self.data('typingTimeOut'));
                }
                self.blur();
                self.triggerHandler('removeAutocompleter');
                self.triggerHandler('removeInstructions');
                break;
              case KEY.RETURN:
                // This prevents form submission
                allowAction = false;
                self.triggerHandler('triggerUseSelectedOrFindMatch', ['return']);
                break;
              case KEY.TAB:
                self.triggerHandler('triggerUseSelectedOrFindMatch', ['tab']);
                self.triggerHandler('removeInstructions');
                self.triggerHandler('removeAutocompleter');
                allowAction = false;

                self.blur();

                if (e.shiftKey) {
                  utils.previousField(self).focus();
                } else {
                  utils.nextField(self).focus();
                }

                break;
              case KEY.DOWN:
                self.triggerHandler('selectNext');
                break;
              case KEY.UP:
                self.triggerHandler('selectPrevious');
                break;
              default:
                return;
            }

            // Tracking to ignore the keyup event for any of the non default cases, as we don't want the autocompleter to find matches based on these keys.
            self.data('supressKey', true);

            return allowAction;
          })


        // Companion to the above keydown event listener - Decides if we want to update the results based on the keypress and also handles typing timeout
          .bind('keyup.autocomplete', function (e) {
            if (self.data('supressKey')) {
              self.data("supressKey", false);
              return;
            }

            var key = e.keyCode;
            // >= 48 ignores things we aren't interested in such as control and page up, keyCode gives a unicode value, for more detail google or look at           
            // http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/javascript-char-codes-key-codes.aspx
            if (key >= 48 || key == KEY.DEL || key == KEY.BS) {
              if (self.data('typingTimeOut')) {
                clearInterval(self.data('typingTimeOut'));
              }

              self.data("typingTimeOut", setTimeout(function () {
                self.triggerHandler('findMatches');
              }, opt.typingTimeOut));
            }
          })

        // If either return or tab are pressed, use whatever is selected. If nothing is selected, then find exact matches from the text in the input
          .bind('triggerUseSelectedOrFindMatch', function (e, triggeringAction) {
            if (self.data('autocompleter') && self.data('autocompleter').find('.' + opt.selectedClass).length > 0) {
              self.triggerHandler('useSelectedItem', [triggeringAction]);
            } else if (opt.enableExactMatching) {
              self.triggerHandler('findExactMatches', [triggeringAction]);
            }
          })

        // On input focus, works out if instructions should be displayed
          .bind('focus.autocomplete', function () {
            var text = opt.inputFilter($.trim(self.val()));

            if (text.length == 0) {
              self.triggerHandler('showInstructions');
            }
          })


        // Triggered when there is text in the input that we want to use to find autocompleter results. Will either search through passed in array 
        // using the opt.mathFromLocal method, or make a JSON request to the passed in URL. Fires off the showMatches event to display these matches.
        // When making an ajax request, the 'text' paramter contains a cleansed version of the entered text, and expects a hash, with a "matches" item 
        // containing an array of matches
          .bind('findMatches', function () {
            var text = opt.inputFilter($.trim(self.val()));

            if (text != "") {
              self.triggerHandler('removeInstructions');

              if ($.type(matchSource) == 'array') {
                // Using passed in array of matches
                var matches = opt.matchFromLocal(text, matchSource).slice(0, opt.maxItems);
                if (matches.length > 0) {
                  self.triggerHandler('showMatches', [matches, text]);
                } else {
                  self.triggerHandler('removeAutocompleter');
                }
              } else {
                // Making JSON request for matches
                self.addClass(opt.loadingClass);
                $.getJSON(matchSource, $.extend(opt.getUrlParameters, { text: text }), function (data) {
                  self.removeClass(opt.loadingClass);

                  if (data.matches.length > 0) {
                    self.triggerHandler('showMatches', [data.matches, text]);
                  } else {
                    self.triggerHandler('removeAutocompleter');
                  }
                });
              }
            } else {
              self.triggerHandler('removeAutocompleter');
              self.triggerHandler('showInstructions');
            }
          })


        // Triggered when there is text in the input that we want to use to find exact matches for, and immediately fire itemChosen from. 
        // Will either search through passed in array using the opt.mathFromLocal method, or make a JSON request to the passed in URL.
        // If using the passed in url, will pass both a 'text' paramter containing a cleansed version of the entered text, as well as a 
        // boolean value of 'exact'. The JSON returned should be a hash, with a "matches" item containing an array of matches, as well as
        // a "failed"  item containing an array of the terms that could not be matched against.

        // Note: This skips displaying the autocompleter entirely.
          .bind('findExactMatches', function (e, triggeringAction) {
            var text = opt.inputFilter($.trim(self.val()));

            self.triggerHandler('findingExactMatchesFor', [text, triggeringAction]);

            if (text != "") {
              self.triggerHandler('removeInstructions');

              if ($.type(matchSource) == 'array') {
                // Using passed in array of matches
                var items = text.split(opt.exactMatchSeperatorRegex);
                var failed = [];

                $.each(items, function (i, item) {
                  var matchArray = opt.matchFromLocal(item, matchSource, true);
                  if (matchArray.length > 0) {
                    self.triggerHandler('itemChosen', [matchArray[0], text]);
                  } else {
                    failed.push(item);
                  }
                });

                if (failed.length > 0) {
                  self.triggerHandler('errorFeedback.autocomplete', ['failed on exact match', failed]);
                }
              } else {
                // Making JSON request for matches
                self.addClass(opt.loadingClass);
                $.getJSON(matchSource, $.extend(opt.getUrlParameters, { text: text, exact: true }), function (data) {
                  self.removeClass(opt.loadingClass);

                  $.each(data.matches, function (i, match) {
                    self.triggerHandler('itemChosen', [match, text]);
                  });

                  if (data.failed.length > 0) {
                    self.triggerHandler('errorFeedback.autocomplete', ['failed on exact match', data.failed]);
                  }
                });
              }

            }

            // This is required for the situation where either selectFirstItem is not true and the user presses return without selecting anything
            self.triggerHandler('removeAutocompleter');
          })


        // Shows instructions to the user, positioning them using utils.insertAbsoluteElement
          .bind('showInstructions', function () {
            if (!self.data('instructions') && opt.instructions) {
              var instructions = opt.instructions.hide();
              utils.insertAbsoluteElement(opt.anchorTo || self, instructions);
              instructions.fadeIn(opt.fadeInSpeed);
              self.data('instructions', instructions);

              self.triggerHandler('instructionsShown', [instructions]);
            }
          })


        // Displays the autocompleter to the user
        // Here title and match elements are created from the opt.groupingTitle and opt.matchTemplate, and appended to the autocompleter ul.
        // The ul is then wrapped using opt.autocompleterTemplate, and then inserted into the dom using utils.insertAbsoluteElement
          .bind('showMatches', function (e, matches, textUserEntered) {
            var currentGroupingTitle;

            var autocompleter = $("<ul/>")
              .addClass(opt.autocompleterClass)
              .addClass(opt.alignment)
              .data('textUserEntered', textUserEntered);

            $.each(matches, function (i, match) {
              var title = opt.groupingTitle(match);

              if (title && title != currentGroupingTitle) {
                currentGroupingTitle = title;

                $('<li/>')
                  .addClass(opt.groupTitleClass)
                  .html(title)
                  .appendTo(autocompleter);
              }

              $('<li/>')
                .html(opt.matchTemplate(match, textUserEntered, utils.highlight))
                .addClass(i % 2 ? 'even' : 'odd')
                .addClass(opt.selectableClass)
                .data('dataObject', match)
                .appendTo(autocompleter);
            });

            autocompleter = opt.autocompleterTemplate(autocompleter);
            self.triggerHandler('removeAutocompleter');
            utils.insertAbsoluteElement(opt.anchorTo || self, autocompleter, true);
            self.data('autocompleter', autocompleter);

            self.triggerHandler('addSelectionListeners.autocomplete');

            if (opt.selectFirstItem) {
              self.triggerHandler('selectNext');
            }

            self.triggerHandler('autocompleterShown', [autocompleter]);
          })


        // Add page click listener to hide the autocompleter / instructions when they are showing and a click occurs outside them
          .bind('addClickOutsideListener.autocomplete', function () {
            $(document).bind('click.autocomplete', function (e) {
              if (self.data('autocompleter') && !$(e.target).is(self) && $(e.target).closest(self.data('autocompleter')).length == 0) {
                self.triggerHandler('removeAutocompleter');
              }

              if (self.data('instructions') && !$(e.target).is(self) && $(e.target).closest(self.data('instructions')).length == 0) {
                self.triggerHandler('removeInstructions');
              }
            });
          })

        // Add a window resize listener to reposition the autocompleter / instructions if the window is resized
          .bind('addWindowResizeListener.autocomplete', function () {
            $(window).bind('resize.autocomplete', function () {
              if (self.data('autocompleter')) {
                utils.setAbsoluteElementsLeftProperty(self, self.data('autocompleter'));
              }

              if (self.data('instructions')) {
                utils.setAbsoluteElementsLeftProperty(self, self.data('instructions'));
              }
            });
          })

        // Add listeners to the autocompleter ul. These are for the mouse selection / highlighting of items, and the use of a specific item when it is clicked on. 
          .bind('addSelectionListeners.autocomplete', function () {
            self.data('autocompleter')
              .bind('click.autocomplete', function (e) {
                if ($(e.target).closest('li.' + opt.selectableClass)[0]) {
                  self.data('supressKey', false);
                  self.triggerHandler('useSelectedItem', ['click']);
                }
              })
              .bind('mouseover.autocomplete', function (e) {
                var li = $(e.target).closest('li.' + opt.selectableClass);

                if (li[0] && !li.hasClass(opt.selectedClass)) {
                  li.addClass(opt.selectedClass).siblings().removeClass(opt.selectedClass);
                }
              });
          })


        // Select the next selectable item in the autocompleter. If nothing is selected, select the first selectable item
          .bind('selectNext', function () {
            if (self.data('autocompleter')) {
              var ulSelector = 'ul.' + opt.autocompleterClass;
              var ul = self.data('autocompleter').is(ulSelector) ? self.data('autocompleter') : self.data('autocompleter').find(ulSelector);
              var next = ul.children('.' + opt.selectedClass).next('.' + opt.selectableClass);
              var toSelect = next.length == 1 ? next : ul.children('.' + opt.selectableClass + ':first');
              toSelect.addClass(opt.selectedClass).siblings().removeClass(opt.selectedClass);

              self.triggerHandler('nextSelected', [toSelect]);
            }
          })


        // Select the previous selectable item in the autocompleter. If nothing is selected, select the last selectable item
          .bind('selectPrevious', function () {
            if (self.data('autocompleter')) {
              var ulSelector = 'ul.' + opt.autocompleterClass;
              var ul = self.data('autocompleter').is(ulSelector) ? self.data('autocompleter') : self.data('autocompleter').find(ulSelector);
              var prev = ul.children('.' + opt.selectedClass).prev('.' + opt.selectableClass);
              var toSelect = prev.length == 1 ? prev : ul.children('.' + opt.selectableClass + ':last');
              toSelect.addClass(opt.selectedClass).siblings().removeClass(opt.selectedClass);

              self.triggerHandler('previousSelected', [toSelect]);
            }
          })


        // Fire off itemChosen event for whichever item is currently selected.
          .bind('useSelectedItem', function (e, triggeringAction) {
            var selected = self.data('autocompleter').find('.' + opt.selectedClass);
            self.triggerHandler('itemChosen', [selected.data('dataObject'), self.data('autocompleter').data('textUserEntered'), selected]);
            self.triggerHandler('removeAutocompleter');
          })


        // Remove autocompleter from the dom and clear out our reference to it
          .bind('removeAutocompleter', function () {
            if (self.data('autocompleter')) {
              self.data('autocompleter').remove();
              self.data('autocompleter', null);
            }
          })


        // Remove instructions from the dom and clear out our reference to it
          .bind('removeInstructions', function () {
            if (self.data('instructions')) {
              self.data('instructions').remove();
              self.data('instructions', null);
            }
          });


        // On plugin load, fire off init
        self.triggerHandler('init.autocomplete');
      });
    }
  });
})(jQuery);
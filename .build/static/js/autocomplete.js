
(function(c) {
    c.fn.extend({
        autocomplete: function(n, b) {
            b = c.extend({
                loadingClass: "loading",
                autocompleterOpenClass: "autocompleter-open",
                instructionsOpenClass: "instructions-open",
                selectedClass: "selected",
                selectableClass: "selectable",
                groupTitleClass: "group-title",
                autocompleterClass: "autocomplete",
                maxLocalResults: 10,
                maxHeightInItems: null,
                selectedID: null,
                selectFirstItem: !0,
                enableExactMatching: !0,
                typingTimeOut: 0,
                fadeInSpeed: 200,
                fadeOutSpeed: 200,
                alignment: "left",
                getUrlParameters: {},
                topOffset: 0,
                leftOffset: 8,
                focusNextFieldOnItemSelect: !1,
                anchorTo: null,
                multiTermSeperatorRegex: /\s*(?:,|\s&\s|\sand\s)\s*/i,
                instructions: null,
                ignoreClicksOn: null,
                groupingTitle: function(b) {
                    return null
                },
                inputFilter: function(b) {
                    return b
                },
                autocompleterTemplate: function(b) {
                    return b
                },
                matchTemplate: function(b, c, e) {
                    return b.matchedAlias ? b.name + " (" + e(c, b.matchedAlias) + ")" : e(c, b.name)
                },
                matchFromLocal: function(b, g, e, f, a) {
                    var d = [],
                        h = e(b);
                    c.each(g, function(k, g) {
                        var e = [g.name].concat(g.aliases || []);
                        c.each(e, function(e, k) {
                            if (a ? k.toLowerCase() ==
                                b.toLowerCase() : k.match(h)) return d.push(c.extend(g, {
                                matchedAlias: 0 == e ? null : k
                            })), !1
                        })
                    });
                    d.sort(f);
                    return d
                }
            }, b);
            var f = {
                highlight: function(b, g) {
                    var e = c.trim(b);
                    return 0 == b.length ? g : g.replace(f.regexToMatchWordStart(e), function(b) {
                        return "<em>" + b + "</em>"
                    })
                },
                regexToMatchWordStart: function(b) {
                    b = c.trim(b).replace(/([\\\^\$*+[\]?{}.=!:(|)])/g, "\\$1");
                    return new RegExp("(?:^|\\s)" + b, "i")
                },
                sortBySortProperty: function(b, c) {
                    return b.sort < c.sort ? -1 : b.sort > c.sort ? 1 : 0
                },
                insertAbsoluteElement: function(b, c, e) {
                    c.css("position",
                        "absolute").appendTo("body");
                    f.setAbsoluteElementsTopProperty(b, c);
                    e && (e = c.outerWidth() - c.width(), c.width(b.outerWidth() - e));
                    f.setAbsoluteElementsLeftProperty(b, c)
                },
                setAbsoluteElementsLeftProperty: function(c, f) {
                    var e = c.offset().left + b.leftOffset;
                    "right" == b.alignment && (e = e + c.outerWidth() - f.outerWidth());
                    f.css("left", e + "px")
                },
                setAbsoluteElementsTopProperty: function(c, f) {
                    var e = c.offset().top + c.outerHeight(!1) + b.topOffset;
                    f.css("top", e + "px")
                },
                getFieldByRelativeTabIndex: function(b, f) {
                    var e = c(b.closest("form").find("a[href], button, input, select, textarea").filter(":visible").filter(":enabled").toArray().sort(function(b,
                        a) {
                        return (0 < b.tabIndex ? b.tabIndex : 1E3) - (0 < a.tabIndex ? a.tabIndex : 1E3)
                    }));
                    return e.eq((e.index(b) + f) % e.length)
                },
                nextField: function(b) {
                    return f.getFieldByRelativeTabIndex(b, 1)
                },
                previousField: function(b) {
                    return f.getFieldByRelativeTabIndex(b, -1)
                }
            };
            return this.each(function() {
                var m, g, e = !1,
                    p = b.selectedID,
                    a = c(this).on("init.autocomplete", function() {
                        a.attr("autocomplete", "off");
                        "array" == c.type(n) && a.triggerHandler("setLocalMatchArray", [n]);
                        a.triggerHandler("addClickOutsideListener.autocomplete");
                        a.triggerHandler("addWindowResizeListener.autocomplete")
                    }).on("setLocalMatchArray",
                        function(a, b) {
                            m = b
                        }).on("keydown.autocomplete", function(b) {
                        switch (b.keyCode) {
                            case 27:
                                return a.data("typingTimeOut") && clearInterval(a.data("typingTimeOut")), a.blur(), a.triggerHandler("removeAutocompleter"), a.triggerHandler("removeInstructions"), !0;
                            case 13:
                                return a.triggerHandler("triggerUseSelectedOrFindMatch", ["return"]), !1;
                            case 9:
                                return a.triggerHandler("triggerUseSelectedOrFindMatch", ["tab"]), a.triggerHandler("removeInstructions"), b.shiftKey ? f.previousField(a).focus() : f.nextField(a).focus(), !1;
                            case 40:
                                a.triggerHandler("selectNext");
                                break;
                            case 38:
                                a.triggerHandler("selectPrevious");
                                break;
                            default:
                                return !0
                        }
                        a.data("supressKey", !0)
                    }).on("keyup.autocomplete", function(d) {
                        if (a.data("supressKey")) a.data("supressKey", !1);
                        else if (d = d.keyCode, 48 <= d || 46 == d || 8 == d) a.data("typingTimeOut") && clearInterval(a.data("typingTimeOut")), a.data("typingTimeOut", setTimeout(function() {
                            a.triggerHandler("findMatches")
                        }, b.typingTimeOut))
                    }).on("triggerUseSelectedOrFindMatch", function(d, c) {
                        a.data("autocompleter") && 0 < a.data("autocompleter").find("." + b.selectedClass).length ?
                            a.triggerHandler("useSelectedItem", [c]) : b.enableExactMatching && a.triggerHandler("findExactMatches", [c])
                    }).on("focus.autocomplete", function() {
                        a.data("autocompleter") || ("" == b.inputFilter(c.trim(a.val())) ? a.triggerHandler("showInstructionsOrAllIfRequired") : a.triggerHandler("findMatches"))
                    }).on("showInstructionsOrAllIfRequired", function(d, c) {
                        b.instructions ? a.triggerHandler("showInstructions", c) : m && a.triggerHandler("showMatches", [m, "", c])
                    }).on("findMatches", function() {
                        var d = b.inputFilter(c.trim(a.val()));
                        if ("" == d) a.triggerHandler("removeAutocompleter", !0), a.triggerHandler("showInstructionsOrAllIfRequired", !0);
                        else if (a.triggerHandler("removeInstructions", !0), m) {
                            var h = b.matchFromLocal(d, m, f.regexToMatchWordStart, f.sortBySortProperty);
                            b.instructions && (h = h.slice(0, b.maxLocalResults));
                            0 < h.length ? a.triggerHandler("showMatches", [h, d, !0]) : a.triggerHandler("removeAutocompleter")
                        } else a.addClass(b.loadingClass), c.getJSON(n, c.extend(b.getUrlParameters, {
                            text: d
                        }), function(c) {
                            a.removeClass(b.loadingClass);
                            0 < c.matches.length ?
                                a.triggerHandler("showMatches", [c.matches, d, !0]) : a.triggerHandler("removeAutocompleter")
                        })
                    }).on("findExactMatches", function(d, h) {
                        var e = b.inputFilter(c.trim(a.val()));
                        a.triggerHandler("findingExactMatchesFor", [e, h]);
                        if ("" != e)
                            if (a.triggerHandler("removeInstructions"), m) {
                                var g = b.multiTermSeperatorRegex ? e.split(b.multiTermSeperatorRegex) : [e],
                                    q = [];
                                c.each(g, function(d, c) {
                                    if ("" != c) {
                                        var h = b.matchFromLocal(c, m, f.regexToMatchWordStart, f.sortBySortProperty, !0);
                                        0 < h.length ? a.triggerHandler("itemChosen", [h[0],
                                            e
                                        ]) : q.push(c)
                                    }
                                });
                                0 < q.length ? a.triggerHandler("errorFeedback.autocomplete", ["failed on exact match", q]) : "tab" != h && b.focusNextFieldOnItemSelect && f.nextField(a).focus()
                            } else a.addClass(b.loadingClass), c.getJSON(n, c.extend(b.getUrlParameters, {
                                text: e,
                                exact: !0
                            }), function(d) {
                                a.removeClass(b.loadingClass);
                                c.each(d.matches, function(b, d) {
                                    a.triggerHandler("itemChosen", [d, e])
                                });
                                0 < d.failed.length ? a.triggerHandler("errorFeedback.autocomplete", ["failed on exact match", d.failed]) : "tab" != h && b.focusNextFieldOnItemSelect &&
                                    f.nextField(a).focus()
                            });
                        a.triggerHandler("removeAutocompleter")
                    }).on("showInstructions", function(d, c) {
                        if (!a.data("instructions") && b.instructions) {
                            var e = b.instructions.hide();
                            f.insertAbsoluteElement(b.anchorTo || a, e);
                            e.fadeIn(c ? 0 : b.fadeInSpeed);
                            a.data("instructions", e);
                            a.addClass(b.instructionsOpenClass);
                            a.triggerHandler("instructionsShown", [e])
                        }
                    }).on("showMatches", function(d, e, k, g) {
                        var m, l = c("<ul/>").addClass(b.autocompleterClass).addClass(b.alignment).data("textUserEntered", k);
                        c.each(e, function(a,
                            d) {
                            var e = b.groupingTitle(d);
                            e && e != m && (m = e, c("<li/>").addClass(b.groupTitleClass).html(e).appendTo(l));
                            c("<li/>").html(b.matchTemplate(d, k, f.highlight)).addClass(a % 2 ? "even" : "odd").addClass(d.id == p ? b.selectedClass : null).addClass(b.selectableClass).data("dataObject", d).appendTo(l)
                        });
                        l = b.autocompleterTemplate(l);
                        a.triggerHandler("removeAutocompleter", !0);
                        f.insertAbsoluteElement(b.anchorTo || a, l, !0);
                        l.hide().fadeIn(g ? 0 : b.fadeInSpeed);
                        a.data("autocompleter", l);
                        a.triggerHandler("addSelectionListeners.autocomplete");
                        a.addClass(b.autocompleterOpenClass);
                        d = b.maxHeightInItems || b.maxLocalResults;
                        e.length > d && l.css("overflow", "auto").height(Math.ceil((d - .5) * l.children("." + b.selectableClass + ":first").outerHeight(!0)));
                        1 != c.grep(e, function(a) {
                            return a.id == p
                        }).length && a.trigger("selectNext");
                        l.on("mousedown", function(a) {
                            a.preventDefault()
                        });
                        a.triggerHandler("ensureSelectedVisible");
                        a.triggerHandler("autocompleterShown", [l])
                    }).on("setSelectedID", function(a, b) {
                        p = b
                    }).on("addClickOutsideListener.autocomplete", function() {
                        c(document).on("click.autocomplete",
                            function(d) {
                                a.data("autocompleter") && 0 == c(d.target).closest(a.add(a.data("autocompleter")).add(b.ignoreClicksOn)).length && a.triggerHandler("removeAutocompleter");
                                a.data("instructions") && 0 == c(d.target).closest(a.add(a.data("instructions")).add(b.ignoreClicksOn)).length && a.triggerHandler("removeInstructions")
                            })
                    }).on("addWindowResizeListener.autocomplete", function() {
                        c(window).on("resize.autocomplete", function() {
                            a.data("autocompleter") && f.setAbsoluteElementsLeftProperty(a, a.data("autocompleter"));
                            a.data("instructions") &&
                                f.setAbsoluteElementsLeftProperty(a, a.data("instructions"))
                        })
                    }).on("addSelectionListeners.autocomplete", function() {
                        a.data("autocompleter").on("click.autocomplete", function(d) {
                            c(d.target).closest("li." + b.selectableClass)[0] && (a.data("supressKey", !1), a.triggerHandler("useSelectedItem", ["click"]), a.blur(), d.stopPropagation())
                        }).on("mouseover.autocomplete", function(a) {
                            e || (a = c(a.target).closest("li." + b.selectableClass), a[0] && !a.hasClass(b.selectedClass) && a.addClass(b.selectedClass).siblings().removeClass(b.selectedClass))
                        })
                    }).on("selectNext",
                        function() {
                            if (a.data("autocompleter")) {
                                var d = "ul." + b.autocompleterClass,
                                    d = a.data("autocompleter").is(d) ? a.data("autocompleter") : a.data("autocompleter").find(d),
                                    c = d.children("." + b.selectedClass).next("." + b.selectableClass),
                                    d = 1 == c.length ? c : d.children("." + b.selectableClass + ":first");
                                d.addClass(b.selectedClass).siblings().removeClass(b.selectedClass);
                                a.triggerHandler("ensureSelectedVisible");
                                a.triggerHandler("nextSelected", [d])
                            }
                        }).on("selectPrevious", function() {
                        if (a.data("autocompleter")) {
                            var d = "ul." +
                                b.autocompleterClass,
                                d = a.data("autocompleter").is(d) ? a.data("autocompleter") : a.data("autocompleter").find(d),
                                c = d.children("." + b.selectedClass).prev("." + b.selectableClass),
                                d = 1 == c.length ? c : d.children("." + b.selectableClass + ":last");
                            d.addClass(b.selectedClass).siblings().removeClass(b.selectedClass);
                            a.triggerHandler("ensureSelectedVisible");
                            a.triggerHandler("previousSelected", [d])
                        }
                    }).on("ensureSelectedVisible", function() {
                        if (a.data("autocompleter")) {
                            var c = a.data("autocompleter").find("." + b.selectedClass);
                            if (c[0]) {
                                var f = c.parent(),
                                    k = c.position().top,
                                    c = k + c.outerHeight(!1);
                                e = !0;
                                c > f.height() ? f.scrollTop(f.scrollTop() + c - f.height()) : 0 > k && f.scrollTop(k + f.scrollTop());
                                clearTimeout(g);
                                g = setTimeout(function() {
                                    e = !1
                                }, 100)
                            }
                        }
                    }).on("useSelectedItem", function(c, e) {
                        var g = a.data("autocompleter").find("." + b.selectedClass);
                        a.triggerHandler("itemChosen", [g.data("dataObject"), a.data("autocompleter").data("textUserEntered"), g]);
                        "tab" != e && b.focusNextFieldOnItemSelect && f.nextField(a).focus();
                        a.triggerHandler("removeAutocompleter")
                    }).on("removeAutocompleter",
                        function(c, e) {
                            a.data("autocompleter") && (f.setAbsoluteElementsTopProperty(a, a.data("autocompleter")), a.data("autocompleter").fadeOut(e ? 0 : b.fadeOutSpeed, function() {
                                a.data("autocompleter").remove();
                                a.data("autocompleter", null);
                                a.removeClass(b.autocompleterOpenClass)
                            }))
                        }).on("removeInstructions", function(c, e) {
                        a.data("instructions") && (f.setAbsoluteElementsTopProperty(a, a.data("instructions")), a.data("instructions").fadeOut(e ? 0 : b.fadeOutSpeed, function() {
                            a.data("instructions").remove();
                            a.data("instructions",
                                null);
                            a.removeClass(b.instructionsOpenClass)
                        }))
                    });
                a.triggerHandler("init.autocomplete")
            })
        }
    })
})(jQuery);
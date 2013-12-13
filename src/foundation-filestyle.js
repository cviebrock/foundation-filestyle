/**
 * foundation-filestyle
 * https://github.com/cviebrock/foundation-filestyle
 *
 * Copyright (c) 2013 Colin Viebrock
 * Vesrion 1.0
 * Licensed under the MIT license.
 *
 *
 * Adapted from:
 *
 * bootstrap-filestyle
 * http://dev.tudosobreweb.com.br/bootstrap-filestyle/
 *
 * Copyright (c) 2013 Markus Vinicius da Silva Lima
 * Version 1.0.3
 * Licensed under the MIT license.
 */
(function ($) {
    "use strict";

    var Filestyle = function (element, options) {
        this.options = options;
        this.$elementFilestyle = [];
        this.$element = $(element);
    };

    Filestyle.prototype = {
        clear: function () {
            this.$element.val('');
            this.$elementFilestyle.find(':text').val('');
        },

        destroy: function () {
            this.$element
                .removeAttr('style')
                .removeData('filestyle')
                .val('');
            this.$elementFilestyle.remove();
        },

        icon: function (value) {
            if (value === true) {
                if (!this.options.icon) {
                    this.options.icon = true;
                    this.$elementFilestyle.find('label').prepend(this.htmlIcon());
                }
            } else if (value === false) {
                if (this.options.icon) {
                    this.options.icon = false;
                    this.$elementFilestyle.find('i').remove();
                }
            } else {
                return this.options.icon;
            }
        },

        input: function (value) {
            if (value === true) {
                if (!this.options.input) {
                    this.options.input = true;
                    this.$elementFilestyle.prepend(this.htmlInput());

                    var content = '',
                        files = [];
                    if (this.$element[0].files === undefined) {
                        files[0] = {'name': this.$element[0].value};
                    } else {
                        files = this.$element[0].files;
                    }

                    for (var i = 0; i < files.length; i++) {
                        content += files[i].name.split("\\").pop() + ', ';
                    }
                    if (content !== '') {
                        this.$elementFilestyle.find(':text').val(content.replace(/\, $/g, ''));
                    }
                }
            } else if (value === false) {
                if (this.options.input) {
                    this.options.input = false;
                    this.$elementFilestyle.find(':text').remove();
                }
            } else {
                return this.options.input;
            }
        },

        buttonText: function (value) {
            if (value !== undefined) {
                this.options.buttonText = value;
                this.$elementFilestyle.find('label span').html(this.options.buttonText);
            } else {
                return this.options.buttonText;
            }
        },

        classButton: function (value) {
            if (value !== undefined) {
                this.options.classButton = value;
                this.$elementFilestyle.find('label').addClass(this.options.classButton);
            } else {
                return this.options.classButton;
            }
        },

        classIcon: function (value) {
            if (value !== undefined) {
                this.options.classIcon = value;
            } else {
                return this.options.classIcon;
            }
        },

        classInput: function (value) {
            if (value !== undefined) {
                this.options.classInput = value;
                this.$elementFilestyle.find(':text').addClass(this.options.classInput);
            } else {
                return this.options.classInput;
            }
        },

        htmlIcon: function () {
            if (this.options.icon) {
                var colorIcon = '';
                return '<i class="'+colorIcon+this.options.classIcon+'"></i> ';
            } else {
                return '';
            }
        },

        htmlInput: function () {
            if (this.options.input) {
                return '<input type="text" class="'+this.options.classInput+'" readonly> ';
            } else {
                return '';
            }
        },

        constructor: function () {
            var _self = this,
                button = '',
                label = '',
                id = this.$element.attr('id'),
                files = [];

            if (id === '' || !id) {
                id = 'filestyle-'+$('.foundation-filestyle').length;
                this.$element.attr({'id': id});
            }

            if (this.options.iconBefore) {
                button = this.htmlIcon()+' '+this.options.buttonText;
            } else {
                button = this.options.buttonText+' '+this.htmlIcon();
            }

            label = '<label for="'+id+'" class="'+this.options.classButton+'" style="margin-bottom:0;">'+
                button+
                '</label>';

            if (this.options.buttonBefore) {
                this.$elementFilestyle = $(
                    '<div class="foundation-filestyle row collapse">'+
                    '<div class="small-3 columns">'+label+'</div>'+
                    '<div class="small-9 columns">'+this.htmlInput()+'</div>'+
                    '</div>'
                );
            } else {
                this.$elementFilestyle = $(
                    '<div class="foundation-filestyle row collapse">'+
                    '<div class="small-9 columns">'+this.htmlInput()+'</div>'+
                    '<div class="small-3 columns">'+label+'</div>'+
                    '</div>'
                );
            }

            var $label = this.$elementFilestyle.find('label');

            if (this.options.buttonBefore) {
                $label.addClass('prefix');
            } else {
                $label.addClass('postfix');
            }


            var $labelFocusableContainer = $label.parent();

            $labelFocusableContainer
                .attr('tabindex', "0")
                .keypress(function(e) {
                    if (e.keyCode === 13 || e.charCode === 32) {
                        $label.click();
                    }
                });

            // hidding input file and add filestyle
            this.$element
                .css({'position':'fixed','left':'-9999px'})
                .attr('tabindex', "-1")
                .after(this.$elementFilestyle);

            // Getting input file value
            this.$element.change(function () {
                var content = '';
                if (this.files === undefined) {
                    files[0] = {'name': this.value};
                } else {
                    files = this.files;
                }

                for (var i = 0; i < files.length; i++) {
                    content += files[i].name.split("\\").pop() + ', ';
                }

                if (content !== '') {
                    _self.$elementFilestyle.find(':text').val(content.replace(/\, $/g, ''));
                }
            });

            // Check if browser is Firefox
            if (window.navigator.userAgent.search(/firefox/i) > -1) {
                // Simulating choose file for firefox
                this.$elementFilestyle.find('label').click(function () {
                    _self.$element.click();
                    return false;
                });
            }
        }
    };

    var old = $.fn.filestyle;

    $.fn.filestyle = function (option, value) {
        var get = '',
            element = this.each(function () {
                if ($(this).attr('type') === 'file') {
                    var $this = $(this),
                        data = $this.data('filestyle'),
                        options = $.extend({}, $.fn.filestyle.defaults, option, typeof option === 'object' && option);

                    if (!data) {
                        $this.data('filestyle', (data = new Filestyle(this, options)));
                        data.constructor();
                    }

                    if (typeof option === 'string') {
                        get = data[option](value);
                    }
                }
            });

        if (typeof get !== undefined) {
            return get;
        } else {
            return element;
        }
    };

    $.fn.filestyle.defaults = {
        'buttonBefore': true,
        'iconBefore': true,
        'buttonText': 'Choose file',
        'input': true,
        'icon': true,
        'classButton': 'inline button',
        'classInput': '',
        'classIcon': 'fa fa-folder-open'
    };

    $.fn.filestyle.noConflict = function () {
        $.fn.filestyle = old;
        return this;
    };

    // Data attributes register
    $('.filestyle').each(function () {
        var $this = $(this),
            options = {
                'buttonBefore': $this.attr('data-buttonBefore') === 'false' ? false : true,
                'iconBefore': $this.attr('data-iconBefore') === 'false' ? false : true,
                'buttonText': $this.attr('data-buttonText'),
                'input': $this.attr('data-input') === 'false' ? false : true,
                'icon': $this.attr('data-icon') === 'false' ? false : true,
                'classButton': $this.attr('data-classButton'),
                'classInput': $this.attr('data-classInput'),
                'classIcon': $this.attr('data-classIcon')
            };

        $this.filestyle(options);
    });
})(window.jQuery);
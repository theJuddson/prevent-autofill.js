(function( $ ) {

    var setCursorPosition = function($el, pos) {
        $el.each(function(index, elem) {
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        });
        return this;
    };

    var isNumeric = function(char){
        return /^[0-9]+$/.test(char);
    }

    var isAlpha = function(char){
        return /^[a-zA-Z]+$/.test(char);
    }

    var fromKeyCode = function(keycode, shift){
        var char = String.fromCharCode((96 <= keycode && keycode <= 105) ? keycode-48 : keycode)
        if(isAlpha(char)){
            if(!shift){
                char = char.toLocaleLowerCase();
            }
        } else if(isNumeric(char)){
            if(shift){
                switch(char){
                    case '1': return '!';
                    case '2': return '@';
                    case '3': return '#';
                    case '4': return '$';
                    case '5': return '%';
                    case '6': return '^';
                    case '7': return '&';
                    case '8': return '*';
                    case '9': return '(';
                    case '0': return ')';
                }
            }
        } else {
            switch(keycode){
                case 186: return shift ? ':' : ';';
                case 187: return shift ?  '+' : '=';
                case 188: return shift ? '<' : ',';
                case 189: return shift ? '_' : '-';
                case 190: return shift ? '>' : '.';
                case 191: return shift ? '?' : '/';
                case 192: return shift ? '~' : '`';
                case 219: return shift ? '{' : '[';
                case 220: return shift ? '|' : '\\';
                case 221: return shift ? '}' : ']';
                case 222: return shift ? '"' : '\'';
            }
        }
        return char;
    }

    var caret = function(elem, begin, end) {
        var range;
        if (0 !== elem.length && !elem.is(":hidden")) return "number" == typeof begin ? (end = "number" == typeof end ? end : begin,
            elem.each(function() {
                elem.setSelectionRange ? elem.setSelectionRange(begin, end) : elem.createTextRange && (range = elem.createTextRange(),
                    range.collapse(!0), range.moveEnd("character", end), range.moveStart("character", begin),
                    range.select());
            })) : (elem[0].setSelectionRange ? (begin = elem[0].selectionStart, end = elem[0].selectionEnd) : document.selection && document.selection.createRange && (range = document.selection.createRange(),
            begin = 0 - range.duplicate().moveStart("character", -1e5), end = begin + range.text.length),
        {
            begin: begin,
            end: end,
            len: end - begin
        });
    }


    var withProtection = function(elem){
        elem.keydown(function(e){
            // Allow: home, end, left, right
            if(($.inArray(e.keyCode, [35, 36, 37, 39]) !== -1)){
                return;
            }

            // Allow: tab, enter, escape
            if ($.inArray(e.keyCode, [9, 13, 27]) !== -1){
                return;
            }

            // Allow: CTRL/CMD+Alpha (selection, copy, cut, paste, etc.)
            if((e.ctrlKey === true || e.metaKey === true) && (event.keyCode >= 65 && event.keyCode <= 90)){
               return;
            }

            //For all other cases, stop the key event and handle input manually or ignore entirely.
            e.preventDefault();

            var curCaret = caret(elem);
            var pos = curCaret.begin;
            var len = curCaret.len;

            var currentValue = elem.val();

            // Handle: up, down
            if($.inArray(e.keyCode, [38, 40]) !== -1){
                if(e.keyCode == 38){
                    setCursorPosition(elem, 0);
                } else {
                    setCursorPosition(elem, currentValue.length);
                }
            }
            // Handle: backspace, delete
            if ($.inArray(e.keyCode, [8, 46]) !== -1){
                var deleteLeft = e.keyCode == 8 && len == 0 ? 1 : 0;
                var deleteRight = e.keyCode == 46 && len == 0 ? 1 : len > 0 ? len : 0;
                var leftOfCursor = currentValue.substring(0, pos - deleteLeft);
                var rightOfSelection = currentValue.substring(pos + deleteRight);
                elem.val(leftOfCursor+rightOfSelection);
                setCursorPosition(elem, pos - deleteLeft);
            }
            // Handle normal input keys
            if ((e.keyCode == 32 || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 186 && event.keyCode <= 192) || (event.keyCode >= 219 && event.keyCode <= 222)){
                if(len > 0){
                    var leftOfCursor = currentValue.substring(0, pos);
                    var rightOfSelection = currentValue.substring(pos+len);
                    currentValue = leftOfCursor+rightOfSelection;
                }
                var char = fromKeyCode(e.keyCode, e.shiftKey);
                var newValue = currentValue.substring(0, pos)+char+currentValue.substring(pos);
                elem.val(newValue);
                setCursorPosition(elem, pos+1);
            }
        });
        
        //This looks weird, but if you click on an input that already has focus, Chrome lights up their autofill feature.
        //Dropping and reaquiring focus prevents this.
        elem.click(function(e){
            if($(this).is(":focus")){
                $(this).blur();
                $(this).focus();
            }
        });
    }

    $.fn.preventAutofill = function(){
        this.each(function(index, elem) {
            elem = $(elem);
            elem.attr('autocomplete', 'off');
            withProtection(elem);
        });
        return this;
    }

}( jQuery ));

/******************************************************************************
 * Copyright (C) 2017 Benjamin Kugler
 *****************************************************************************/
$(document).ready(function () {
    'use strict';

    const NEW_LINE = '\n';
    const CLEAR = "";

    var todocl = {
        out: document.getElementById("output"),
        in : document.getElementById("terminal"),
        path: '/todo/todo.txt',
        textArr: null,
        todoText: null,
        todoAdd: false,
        base: 'WhNNvuPtM7UHSDQAAAAAAAADUBNC7LWevO68hfopFHlK0mJBU4MHUAhjGMDG_LxICWviasH9VASmrz9PUShdgZL5',
        todoCommand: null,
        dbx: new Dropbox({
            accessToken: null
        })
    };

    //      7LWevO68hflK0mJBU4MHGMDG_LxICWH9VASmrz9PgL5WhNNvuPtM7QAAAAAAAAD
    //      7LWevO68hflK0mJBU4MHGMDG_LxICWH9VASmrz9PgZL5WhNNvuPtM7QAAAAAAAAD
    //      WhNNvuPtM7QAAAAAAAAD7LWevO68hflK0mJBU4MHGMDG_LxICWH9VASmrz9PgZL5
    //      WhNNvuPtM7 QAAAAAAAAD 7LWevO68hf lK0mJBU4MH GMDG_LxICW H9VASmrz9P gZL5
    //      WhNNvuPtM7UHSDQAAAAAAAADUBNC7LWevO68hfopFHlK0mJBU4MHUAhjGMDG_LxICWviasH9VASmrz9PUShdgZL5

    /**************************************************************************
     * Description: Displays the file to the 'terminal'
     * Variables:   text - Text blob as a string
     *              callBack - call back function to make sure it's all in sync
     *************************************************************************/
    function setText(textArr, callBack) {
        var i;
        for (i = 0; i < textArr.length; i += 1) {
            if (textArr[i] === CLEAR) {
                textArr.splice(i, 1);
            } else {
                todocl.todoText += textArr[i] + NEW_LINE;
            }
        }
        callBack(true);
    }

    /*************************************************************************
     * Description: Displays the text array with formatting
     * This is really gross
     *************************************************************************/
    function displayFile() {
        var i = 0,
            count = 0;

        while (count < (todocl.textArr.length * 5)) {
            if (i == todocl.textArr.length) {
                i = 0;
            }
            if (todocl.textArr[i].substring(0, 3) === '(A)' && count < todocl.textArr.length) {
                todocl.out.innerHTML += "<span style='color:#A40000; font-weight: 900;'>" + (i + 1) + " " + todocl.textArr[i] + NEW_LINE + "</span>";
            }

            if (todocl.textArr[i].substring(0, 3) === '(B)' && count > todocl.textArr.length && count <= (todocl.textArr.length * 2)) {
                todocl.out.innerHTML += "<span style='color:#B24200; font-weight: 900;'>" + (i + 1) + " " + todocl.textArr[i] + NEW_LINE + "</span>";
            }

            if (todocl.textArr[i].substring(0, 3) === '(C)' && count > (todocl.textArr.length * 2) && count <= (todocl.textArr.length * 3)) {
                todocl.out.innerHTML += "<span style='color:#FF790C; font-weight: 900;'>" + (i + 1) + " " + todocl.textArr[i] + NEW_LINE + "</span>";
            }

            if (todocl.textArr[i].substring(0, 3).match(/^([(D-Z)]+)$/) && count > (todocl.textArr.length * 3) && count <= (todocl.textArr.length * 4)) {
                todocl.out.innerHTML += "<span style='color:#FFFFFF; font-weight: 900;'>" + (i + 1) + " " + todocl.textArr[i] + NEW_LINE + "</span>";
            }

            if (todocl.textArr[i].substring(0, 3) !== '(A)' && todocl.textArr[i].substring(0, 3) !== '(B)' && todocl.textArr[i].substring(0, 3) !== '(C)' &&
                !todocl.textArr[i].substring(0, 3).match(/^([(D-Z)]+)$/) && count >= (todocl.textArr.length * 4)) {
                todocl.out.innerHTML += (i + 1) + " " + todocl.textArr[i] + NEW_LINE;
            }
            count++;
            i++;
        }

        todocl.out.innerHTML += "--" + NEW_LINE + "TODO: " +
            todocl.textArr.length + " Of " +
            todocl.textArr.length + " tasks shown";
    }

    /*************************************************************************
     * Description: Reads the todo file on Dropbox
     * Variables:   print - boolean: wether to display the file or not
     *************************************************************************/
    function readFile(print) {
        const ERR_MESS_READ = "TODO: Trouble reading file.";

        var i;

        todocl.dbx.filesDownload({
            path: todocl.path
        }).then(function (response) {
            var textBlob, reader;

            textBlob = response.fileBlob;
            reader = new FileReader();

            reader.addEventListener("loadend", function () {
                var contents = reader.result;
                todocl.textArr = contents.split(NEW_LINE);

                setText(todocl.textArr,
                    function (callBack) {
                        if (callBack && print) {
                            displayFile();
                        }
                        if (callBack) {

                        }
                    });
            });
            reader.readAsText(textBlob);
        }).catch(function (Error) {
            todocl.out.innerHTML = ERR_MESS_READ;
        });
    }

    /*************************************************************************
     * Description: Writes the text to dropbox
     *************************************************************************/
    function writeFile() {
        const ERR_MESS_WRITE = "TODO: Trouble writing file";

        todocl.dbx.filesUpload({
            contents: todocl.todoText,
            path: todocl.path,
            mode: 'overwrite',
            autorename: false,
            mute: true
        }).then(function (response) {

        }).catch(function (error) {
            todocl.dbx.accessToken = null;
            todocl.out.innerHTML = ERR_MESS_WRITE;
        });
    }

    /*************************************************************************
     * Description: Deletes a task from the array and writes
     * Variables:   index - the index of the elements being deleted
     *************************************************************************/
    function deleteTask(index) {
        const ERR_MESS_INDEX = "TODO: Bad Index number";
        var mess = (index + 1) + " x " + "DATE HERE " + todocl.textArr[index];

        if (todocl.textArr[index] !== undefined &&
            todocl.textArr[index] !== null &&
            todocl.textArr !== null) {

            todocl.textArr.splice(index, 1);

            setText(todocl.textArr,
                function (callBack) {
                    if (callBack) {
                        writeFile();
                    }
                });
            todocl.out.innerHTML = mess + '\n' + "TODO: " +
                (index + 1) + " marked as done.";
        } else {
            todocl.out.innerHTML = ERR_MESS_INDEX;
        }
    }

    /*************************************************************************
     * Description: Creats priority or changes one
     *************************************************************************/
    function priTask(pri, index) {
        var newPri;
        var mess;

        if (todocl.textArr[index - 1].substring(0, 3).match(/^([(A-Z)]+)$/)) {
            newPri = "(" + pri + ") " + todocl.textArr[index - 1].substring(3);
            todocl.textArr[index - 1] = newPri;
            mess = index + " " + newPri + '\n' + "TODO: " + index +
                " re-prioritized " + todocl.textArr[index - 1].substring(3) +
                " to " + "(" + pri + ").";
        } else {
            newPri = "(" + pri + ") " + todocl.textArr[index - 1];
            todocl.textArr[index - 1] = newPri;
            mess = index + " " + newPri + '\n' + "TODO: " + index +
                " prioritized " + "(" + pri + ").";
        }

        setText(todocl.textArr,
            function (callBack) {
                if (callBack) {
                    writeFile();
                }
            });
        todocl.out.innerHTML = mess;
    }

    /*************************************************************************
     * Description: Checks the input and calls the specific functions
     *************************************************************************/
    function checkInput() {
        const ERR_MESS_SYNTAX = "TODO: Bad Syntax";
        const OUT_LIST = "t ls";
        const OUT_ADD = "t a";
        const OUT_CLEAR = "clear";
        const OUT_ADD_NUM = /^t do ([0-9]+)$/;
        const OUT_PRI = /^t p ([0-9] [A-Z])$/;
        var index;

        todocl.out.innerHTML = CLEAR;
        todocl.todoText = CLEAR;
        readFile(false);

        if (todocl.todoCommand === OUT_LIST) {
            readFile(true);
        } else if (todocl.todoCommand === OUT_ADD) {
            todocl.todoAdd = true;
            todocl.out.innerHTML = "ADD";
        } else if (todocl.todoCommand === OUT_CLEAR) {
            todocl.out.innerHTML = CLEAR;
        } else if (todocl.todoCommand.match(OUT_PRI)) {
            priTask(todocl.todoCommand.charAt(6), todocl.todoCommand.charAt(4));
        } else if (todocl.todoCommand.match(OUT_ADD_NUM)) {
            index = Number(todocl.todoCommand.charAt(5)) - 1;
            deleteTask(index);
        } else {
            todocl.out.innerHTML = ERR_MESS_SYNTAX;
        }
    }

    /*************************************************************************
     * Description: STUFF
     *************************************************************************/
    function key() {
        var arry = todocl.todoCommand.split(" ");
        var temp = (todocl.base.length / parseInt(arry[0]));

        for (var i = 0; i < (todocl.base.length / parseInt(arry[0])); i++) {
            if (i !== 0)
                console.log(todocl.base.slice((i * parseInt(arry[0]) + (4 * i)), (i * parseInt(arry[0])) + parseInt(arry[0]) + (4 * i)));
            else
                console.log(todocl.base.slice((i * parseInt(arry[0])), (i * parseInt(arry[0])) + parseInt(arry[0])));
        }
        ///CORRECTLY PARSES THE STRING, NEED TO SWITCH IT UP NOW

        var some = todocl.todoCommand;
        var has1 = todocl.base.match('/.{1,' + some + '}/g');
        console.log(has1);

    }

    /*************************************************************************
     * Description: Gets the key enter
     *************************************************************************/
    $("#terminal").on('keyup', function (e) {
        if (e.keyCode === 13) {
            todocl.todoCommand = todocl.in.value;
            todocl.todoText += todocl.todoCommand + NEW_LINE;

            if (todocl.dbx.accessToken === null) {
                key();
            } else {

                if (todocl.todoAdd) {
                    writeFile();
                    todocl.todoAdd = false;
                    todocl.out.innerHTML = (todocl.textArr.length + 1) + " " +
                        todocl.todoCommand + NEW_LINE + "TODO: " +
                        (todocl.textArr.length + 1) + " added";
                } else {
                    checkInput();
                }

                e.preventDefault();
                todocl.in.value = CLEAR;

            }
        }
    });
});
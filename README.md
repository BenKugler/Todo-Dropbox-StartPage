# Todo-Dropbox-StartPage

###### My first exploration with Javscript.
Feel free to contribute or fork.

## About
As a multi-platform user, I jump between Linux and Windows a lot, due to this I set out on finding way to organize events and due dates that I would have access to with all my platforms and different ones later. While google calendar is great, I must navigate my way to the calendar every time I use it, this causes me to overlook dates or events easily. I wanted something that was in your face the movement you open a webpage or was only a couple of keystrokes away. Todo.txt fit one of these for Linux, the terminal setup was great, the commands and support was also a plus. But it lacked a similar web and Windows client to that of the Linux one, I found this to be rather disappointing, so I set out to fix that.

## Goals
While I love todo.txt, the windows and web clients, for me, leave a lot to be desired. They don't have the same feel or look as the Linux Terminal version and feel clunky in comparison, and who wants to learn a bunch of commands and then only use them half the time? That being said, they obviously have some advantages, being that they can be used on any system and any computer that has access to the web. My goal is to emulate the flow of the Linux Terminal todo.txt setup into a Javascript based web version accessible from anywhere and any computer while keeping security in mind.

## Dangers
- This client will have to access Dropbox through a API
- Have access to specific Dropbox files
- This will be a non-local/private webpage, being that it can be accessed anywhere

## Features
- [x] Access Dropbox with a API key
- [x] Read the todo.txt file while keeping the file readable by todo.txt clients
- [x] Write to the file
- [x] Display the goals with different colors depending on the Priority level
- [x] Change priority levels and add priority levels
- [x] Remove a task
- [ ] Add date
- [ ] Append to task

## Conditional Features
- [ ] Keep Decent Documentation
- [ ] Warnings for wrong input
- [X] Warnings for no API Key or no access to Dropbox

## Future Goals
Depending on how far I take this, future goals would be to add a way to read a google calendar and add those events to todo.txt's files with dates and priorities added.

###### Notes
My private edition already has a way to obscure the API Key for Dropbox, it is not advised to leave it where someone could use it and gain access to your files.

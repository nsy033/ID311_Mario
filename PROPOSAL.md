# Individual Project Proposal

| **Name**       | Seungyeon Choi                               |
| :------------- | :------------------------------------------- |
| **Student ID** | 20190656                                     |
| **URL**        | http://git.prototyping.id/20190656/homework5 |

---

## Description

### Target Game

![Mario Gravity Adventure](https://user-images.githubusercontent.com/76762181/232781123-34f491b5-33c0-447d-8ece-378f392f3d42.png) 
- The video game I am going to implement is ***Mario Gravity Adventure***, which is existing one, not invented by me.
- The official service of this game seems to have ended, but [HERE](https://vidkidz.tistory.com/5225) is where I found it still offers this game. You will be able to access [HERE](https://vidkidz.tistory.com/5225) and play ***Mario Gravity Adventure***.
- The pictures below are the screen captures from the original ***Mario Gravity Adventure***.
  - The game consists of several stages and is designed to proceed to the next stage only if the previous stage is cleared.
  - The character *Mario* and elements that make up the world of each stage are very similar to those of the famous game, *Super Mario Brothers*.
  - **However**, *Mario*'s control rules and goals that *Mario* wants to achieve in each stage are a little different, which will be described in more detail below.

| ![Stage Selection](https://user-images.githubusercontent.com/76762181/232781131-82951365-29c1-4ce0-9415-b29cb1f5e400.png) | ![Playing](https://user-images.githubusercontent.com/76762181/232779243-1a25b0b5-5da0-4b7f-9601-6aeeede54a40.png) |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |

### Rule and Interface

- *Mario* can basically move the map using the **keyboard direction keys(up, left, down, and right)**. When *Mario* finally reaches the trophy, one stage is completed.
- Brick or grass means the safe part even if he steps on it or touch it, and the parts with fire or thorn means should not be touched.
- In this game, *Mario* can't do JUMP, which most games implements like the physical world. Instead, *Mario* changes the direction of gravity.
- There are two ways *Mario* can change the direction of gravity on him.
  - When the player **presses SPACEBAR**, *Mario*'s gravity becomes exactly the opposite of the previous direction.
    - For example, if the player presses SPACEBAR while *Mario* standing on the floor, *Mario* will have to step on the ceiling, as shown in the picture on the left below.
    - When *Mario*'s direction of gravity changes, he floats in the air for a while toward a new floor according to gravity.
    - The player can use **keyboard direction keys** to move in directions perpendicular to gravity (left or right) while *Mario* floats toward the next floor.
  - When *Mario* meets the rotation axis while floating, *Mario*'s gravitational direction rotates 90 degrees clockwise.
    - In other words, if the player presses SPACEBAR and *Mario* meets the rotation axis while floating up, the direction that was previously "up" will be changed to "right", and *Mario* will then float toward the "right" wall until it is made to as a new floor.

| ![Stepping North](https://user-images.githubusercontent.com/76762181/232788189-a8227b37-816e-4581-9f0f-c536497ade5a.png) | ![Stepping East](https://user-images.githubusercontent.com/76762181/232788195-87171db2-b594-4770-bc59-0ccfa5c174d3.png) |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |

### Implementation Plan

- **OOP**
  - I'm planning to take *Mario*, bricks, fire, rotational axes, trophies, etc. as objects playing their respective roles and implement them as code.
  - For instance, examples of attributes *Mario* has may include x, y coordinates, gravity directions, and so on.
- **MVC**
  - *Mario* is moving according to the keyboard pressed events. And as I learned in class, it could lead to jittering if the event handling and rendering of the screen are not distinguished.
  - Therefore, I would like to adopt an approach that separates the model, view, and controller.
- **Singleton**
  - Inside each map, there is only one *Mario*, so I think it would be a good way to properly utilize the singleton design pattern.
- **Observer**
  - I'm thinking of considering *Mario* as observer, and rotational axis, thorns, trophies, etc. as subject.
  - This approach may possibly help proper event controls occur by calling callback functions if *Mario* comes into contact with a specific object.
- How to Implement?
  - Tentative Tech Stack: Javascript, p5.js, and p5play.js
  - The animation of *Mario*: If it is recognized that any direction key is pressed, several images will be displayed continuously alternately so that *Mario*'s legs appear to be moving.
  - Feasibility: With the feasibility in mind, the map will provide in pre-defined, and I plan to create only a few stages that are well implemented with functionality rather than providing many stages like the actual original game.
- Challenges?
  - If multiple overlapping events occur at the same time, I am concerned about whether they can be handled well.
  - When *Mario* is in the air, controlling *Mario*'s movement uniformly is likely to be challenging, too. This is because *Mario*'s **floating** must be implemented, not moving him immediately to the ceiling when the direction of gravity is changed according to SPACEBAR pressing.
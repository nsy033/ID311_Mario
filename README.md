# Individual Project Proposal

| **Name**       | Seungyeon Choi |
| :------------- | :------------- |
| **Student ID** | 20190656       |

---

## Description

### Target Game

![Mario Gravity Adventure](https://user-images.githubusercontent.com/76762181/232781123-34f491b5-33c0-447d-8ece-378f392f3d42.png)

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

Original Sound Tracks 
- https://downloads.khinsider.com/game-soundtracks/album/super-mario-64-soundtrack
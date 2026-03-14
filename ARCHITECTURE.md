# PetHeavenOnline World Prototype Architecture

## Project Context

PetHeavenOnline is a pet memorial project.

The long-term product is a Django-based website where users can create memorials for pets including:

- pet name
- species
- birth date
- death date
- description
- photo
- owner
- status (pending / published)

In the long term memorials will appear inside a peaceful exploratory world or garden experience.

## Current Strategy

We are NOT starting with Django or fullstack.

We are first building a standalone frontend world prototype to prove the most challenging part of the product:

- world rendering
- panning and camera movement
- visual feel
- memorial placement
- interaction with memorial objects

Backend integration will come later.

## Current Tech Direction

Phase 1 prototype should use:

- Vite
- Vanilla JavaScript
- PixiJS

Keep the stack minimal unless there is a strong reason otherwise.

## Core Product Goal

We want a world that feels:

- peaceful
- beautiful
- exploratory
- spacious
- alive

The goal is not mathematical infinity.

The goal is an expansive growing memorial world that feels open and immersive.

## Phase 1 Goals

The first prototype should include:

- full browser PixiJS canvas
- seamless repeating grass ground
- camera panning
- memorial objects rendered from mock data
- click interaction on memorial objects
- simple hover or highlight feedback
- clean structure for future extension

## Phase 1 Non Goals

Do NOT implement these yet:

- Django integration
- authentication
- backend APIs
- real database
- AWS S3 integration
- biomes or multiple terrain types
- terrain transitions
- lake or mountain systems
- procedural world generation
- advanced performance optimization unless needed
- overengineered abstractions

## Mock Data Rule

Mock data should be shaped like future real backend data.

Example memorial object:

{
  id: 1,
  slug: "bella-the-dog",
  name: "Bella",
  species: "Dog",
  x: 1200,
  y: 800,
  sprite: "memorial_1",
  image_url: "/mock/dog.jpg",
  status: "published"
}

## World Model Direction

The world should be designed so it can later support:

- chunk based loading
- terrain metadata per chunk
- multiple scenery types
- backend fed memorial objects

However in the first implementation:

- keep terrain as grass only
- keep the structure simple
- avoid full chunk complexity unless required

## Coordinate System

Use a clear and documented world coordinate system from the beginning.

For now:

- memorials exist at world coordinates
- camera movement changes the viewport over the world
- the system should be easy to extend later

## Architecture Principle

Build the simplest version that proves the experience.

Prefer:

- clarity
- small steps
- easy review
- maintainability

Avoid:

- premature abstractions
- fantasy future proofing
- building systems before they are needed

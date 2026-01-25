package app

import "context"

type App struct {
	ctx context.Context
}

func NewApp() (*App, func(ctx context.Context)) {
	app := &App{}
	startup := func(ctx context.Context) {
		app.startup(ctx)
	}
	return app, startup
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

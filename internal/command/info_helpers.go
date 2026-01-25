package command

import (
	"bufio"
	"os"
	"path/filepath"
	"strings"
)

func kubeconfigPath() string {
	if value := os.Getenv("KUBECONFIG"); value != "" {
		return value
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return ""
	}
	return filepath.Join(home, ".kube", "config")
}

func (c *command) findPluginPath(name string) (string, error) {
	out, err := c.kubectl("plugin", "list")
	if err != nil {
		return "", err
	}

	scanner := bufio.NewScanner(strings.NewReader(out))
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}
		if strings.Contains(line, name) {
			return line, nil
		}
	}
	if err := scanner.Err(); err != nil {
		return "", err
	}
	return "", nil
}
